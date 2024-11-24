using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;


[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly RealEstateContext _context;

    public UsersController(RealEstateContext context)
    {
        _context = context;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    // POST: api/users/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userDto)
    {
        try
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Tên người dùng đã tồn tại." });
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                UserName = userDto.UserName,
                PasswordHash = hashedPassword,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                Role = userDto.Role.ToString(),
                IsTwoFactorEnabled = userDto.IsTwoFactorEnabled,
                IsActive = userDto.IsActive
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi máy chủ: " + ex.Message);
        }
    }

    // POST: api/users/login
    [HttpPost("login")]
    public async Task<ActionResult<string>> Login([FromBody] LoginRequest loginRequest)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);
        if (user == null)
        {
            return BadRequest(new { message = "Email người dùng không tồn tại." });
        }

        if (!user.IsActive)
        {
            return BadRequest(new { message = "Tài khoản đã bị vô hiệu hóa." });
        }

        if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
        {
            return BadRequest(new { message = "Mật khẩu không chính xác." });
        }

        var token = GenerateJwtToken(user);
        return Ok(new { message = "Đăng nhập thành công.", token, role = user.Role, userId = user.Id });
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this_is_a_very_long_secret_key_1234567890123456"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "thangBatDongSan",
            audience: "thangBatDongSan",
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.Rentals)
            .Include(u => u.UserComments)
            .Include(u => u.UserFavorites)
            .Include(u => u.ReviewsWritten)
            .Include(u => u.Bookings)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound("User not found");
        }

        return Ok(user);
    }


    // PUT: api/users/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(Guid id, User updatedUser)
    {
        if (id != updatedUser.Id)
        {
            return BadRequest("ID không khớp với ID trong dữ liệu.");
        }

        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null)
        {
            return NotFound();
        }

        existingUser.UserName = updatedUser.UserName;
        existingUser.Email = updatedUser.Email;
        existingUser.PhoneNumber = updatedUser.PhoneNumber;
        existingUser.Role = updatedUser.Role;
        existingUser.IsActive = updatedUser.IsActive;
        existingUser.AvatarUrl = updatedUser.AvatarUrl;

        _context.Entry(existingUser).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
            {
                return NotFound();
            }
            return StatusCode(500, "Có lỗi xảy ra khi cập nhật người dùng.");
        }

        return Ok(existingUser);
    }

    // DELETE: api/users/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/users/upload-avatar
    [HttpPost("upload-avatar/{userId}")]
    public async Task<IActionResult> UploadAvatar(Guid userId, IFormFile avatar)
    {
        if (avatar == null || avatar.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Kiểm tra loại file, kích thước, v.v...
        var fileExtension = Path.GetExtension(avatar.FileName);
        if (fileExtension != ".jpg" && fileExtension != ".png")
        {
            return BadRequest("Invalid file type. Only .jpg and .png are allowed.");
        }

        // Tạo tên file duy nhất để tránh trùng lặp
        var fileName = Guid.NewGuid().ToString() + fileExtension;
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "avatars", fileName);

        // Lưu tệp tin vào thư mục
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await avatar.CopyToAsync(stream);
        }

        // Cập nhật đường dẫn avatar cho user
        user.AvatarUrl = $"/avatars/{fileName}";

        _context.Entry(user).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(new { AvatarPath = user.AvatarUrl });
    }

    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto googleDto)
    {
        try
        {
            var payload = await ValidateGoogleToken(googleDto.IdToken);
            if (payload == null)
            {
                return BadRequest(new { message = "Mã token Google không hợp lệ." });
            }
            var email = payload.Email;

            // Kiểm tra xem email có tồn tại trong hệ thống không
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return Ok(new { email, isNewUser = true });
            }

            if (!user.IsActive)
            {
                return BadRequest(new { message = "Tài khoản đã bị vô hiệu hóa." });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { message = "Đăng nhập thành công.", token, role = user.Role, userId = user.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi máy chủ: " + ex.Message);
        }
    }

    private async Task<GoogleJsonWebSignature.Payload> ValidateGoogleToken(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new List<string> { "942288651749-7o3kthjiu74glonrhk53ejikgr26lj0m.apps.googleusercontent.com" }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return payload;
        }
        catch
        {
            return null;
        }
    }

    private bool UserExists(Guid id)
    {
        return _context.Users.Any(e => e.Id == id);
    }
}
