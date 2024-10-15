using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
            // Kiểm tra nếu người dùng đã tồn tại
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Tên người dùng đã tồn tại." });
            }

            // Mã hóa mật khẩu trước khi lưu vào DB
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

            // Lưu người dùng vào cơ sở dữ liệu
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
            return BadRequest(new { message = "Enmail người dùng không tồn tại." });
        }

        // Kiểm tra trạng thái hoạt động của người dùng
        if (!user.IsActive)
        {
            return BadRequest(new { message = "Tài khoản đã bị vô hiệu hóa." });
        }

        // Kiểm tra mật khẩu
        if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
        {
            return BadRequest(new { message = "Mật khẩu không chính xác." });
        }


        // Tạo token
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
            new Claim(ClaimTypes.Role, user.Role) // Thêm claim role
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this_is_a_very_long_secret_key_1234567890123456")); // Thay đổi key của bạn tại đây
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
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    // PUT: api/users/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(Guid id,User updatedUser)
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
        existingUser.Avatar = updatedUser.Avatar; 


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
    //[Authorize] 
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
    [HttpPost("upload-avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        // Lấy thông tin ID từ claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null)
        {
            return BadRequest("Người dùng không tồn tại.");
        }

        Guid id = Guid.Parse(userIdClaim.Value);
        Console.WriteLine($"User ID: {id}"); // Kiểm tra ID người dùng trong console

        // Tìm người dùng trong cơ sở dữ liệu
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("Người dùng không tồn tại.");
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("File không hợp lệ.");
        }

        // Lưu file vào thư mục
        var filePath = Path.Combine("wwwroot/avatars", file.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Cập nhật avatar của người dùng
        user.Avatar = $"/avatars/{file.FileName}"; // Cập nhật đường dẫn đến avatar
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return Ok(new { url = user.Avatar });
    }



    private bool UserExists(Guid id)
    {
        return _context.Users.Any(e => e.Id == id);
    }
}
