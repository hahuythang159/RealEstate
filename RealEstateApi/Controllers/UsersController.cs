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
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userDto.UserName);
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
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == loginRequest.UserName);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Tên người dùng hoặc mật khẩu không chính xác." });
        }

        // Tạo token
        var token = GenerateJwtToken(user);
        return Ok(new { message = "Đăng nhập thành công.", token, role = user.Role, userId = user.Id });
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
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

    // GET: api/users/5
    [HttpGet("{id}")]
    [Authorize] // Chỉ cho phép người dùng đã xác thực truy cập
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
    [Authorize] // Chỉ cho phép người dùng đã xác thực truy cập
    public async Task<IActionResult> PutUser(Guid id, User user)
    {
        if (id != user.Id)
        {
            return BadRequest();
        }

        _context.Entry(user).State = EntityState.Modified;

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
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/users/5
    [HttpDelete("{id}")]
    //[Authorize] // Chỉ cho phép người dùng đã xác thực truy cập
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

    private bool UserExists(Guid id)
    {
        return _context.Users.Any(e => e.Id == id);
    }
}
