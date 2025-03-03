﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using RealEstateApi.Models;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;


[Route("api/[controller]")]
[ApiController]
public class RentalsController : ControllerBase
{
    private readonly RealEstateContext _context;
    private readonly RentalService _rentalService;
    private readonly IConfiguration _configuration;

    public RentalsController(RealEstateContext context, RentalService rentalService, IConfiguration configuration)
    {
        _context = context;
        _rentalService = rentalService;
        _configuration = configuration;

    }

    // GET: api/rentals
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetRentals()
    {
        var rentals = await _context.Rentals
            .Include(r => r.Property)
            .Include(r => r.Tenant) 
            .Select(r => new
            {
                r.Id,
                r.PropertyId,
                r.TenantId,
                r.StartDate,
                r.EndDate,
                r.Status,
                r.RentPrice,
                PropertyOwnerId = r.Property.OwnerId
            })
            .ToListAsync();

        return Ok(rentals);
    }

    // GET: api/rentals/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Rental>> GetRental(Guid id)
    {
        var rental = await _context.Rentals
            .Include(r => r.Property)
            .Include(r => r.Tenant)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (rental == null)
        {
            return NotFound();
        }

        return rental;
    }

    // POST: api/rentals
    [HttpPost]
    public async Task<ActionResult<Rental>> PostRental(Rental rentalDto)
    {
        try
        {
            var property = await _context.Properties.FindAsync(rentalDto.PropertyId);
            if (property == null)
            {
                return NotFound(new { message = "Bất động sản không tồn tại." });
            }

            var tenant = await _context.Users.FindAsync(rentalDto.TenantId);
            if (tenant == null)
            {
                return NotFound(new { message = "Người thuê không tồn tại." });
            }

            var rental = new Rental
            {
                PropertyId = rentalDto.PropertyId,
                TenantId = rentalDto.TenantId,
                StartDate = rentalDto.StartDate,
                EndDate = rentalDto.EndDate,
                Status = RentalStatus.PendingApproval
            };

            _context.Rentals.Add(rental);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRental), new { id = rental.Id }, rental);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Lỗi máy chủ: " + ex.Message);
        }
    }

    // PUT: api/rentals/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Owner, Manager")]
    public async Task<IActionResult> PutRental(Guid id, Rental rental)
    {
        if (id != rental.Id)
        {
            return BadRequest();
        }

        var existingRental = await _context.Rentals.FindAsync(id);
        if (existingRental == null)
        {
            return NotFound();
        }

        existingRental.StartDate = rental.StartDate;
        existingRental.EndDate = rental.EndDate;
        existingRental.Status = rental.Status;

        _context.Entry(existingRental).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RentalExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/rentals/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRental(Guid id)
    {
        var rental = await _context.Rentals.FindAsync(id);
        if (rental == null)
        {
            return NotFound("Rental not found.");
        }

        _context.Rentals.Remove(rental);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool RentalExists(Guid id)
    {
        return _context.Rentals.Any(e => e.Id == id);
    }

    // GET: api/rentals/pending
    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<Rental>>> GetPendingRentals()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userIdString, out Guid userId))
        {
            var pendingRentals = await _context.Rentals
                .Where(r => r.Status == RentalStatus.PendingApproval &&
                            _context.Properties.Any(p => p.Id == r.PropertyId && p.OwnerId == userId))
                .Include(r => r.Property)
                .Include(r => r.Tenant)
                .ToListAsync();

            return Ok(pendingRentals);
        }

        return BadRequest("User ID không hợp lệ.");
    }
    // GET: api/rentals/canceled
    [HttpGet("canceled")]
    public async Task<ActionResult<IEnumerable<Rental>>> GetCanceledRentals()
    {
        var canceledRentals = await _context.Rentals
            .Where(r => r.Status == RentalStatus.ContractCanceled)
            .Include(r => r.Property)
            .ThenInclude(p => p.Owner)
            .Include(r => r.Tenant)
            .ToListAsync();

        if (!canceledRentals.Any())
        {
            return NotFound(new { message = "Không có hợp đồng nào đã huỷ." });
        }

        var rentalsWithDetails = canceledRentals.Select(rental => new
        {
            rental.Id,
            tenantName = rental.Tenant?.UserName,
            propertyName = rental.Property?.Address,
            ownerName = rental.Property?.Owner?.UserName,
            startDate = rental.StartDate,
            status = rental.Status.ToString(),
        }).ToList();

        return Ok(rentalsWithDetails);
    }
    // GET: api/rentals/approved
    [HttpGet("approved")]
    public async Task<ActionResult<IEnumerable<Rental>>> GetApprovedRentals()
    {
        var approvedRentals = await _context.Rentals
            .Where(r => r.Status == RentalStatus.Approved)
            .Include(r => r.Property)
            .ThenInclude(p => p.Owner)
            .Include(r => r.Tenant)
            .ToListAsync();

        if (!approvedRentals.Any())
        {
            return NotFound(new { message = "Không có hợp đồng nào đã duyệt." });
        }

        var rentalsWithDetails = approvedRentals.Select(rental => new
        {
            rental.Id,
            tenantName = rental.Tenant?.UserName, 
            tenantId = rental.Tenant?.Id,
            propertyName = rental.Property?.Address, 
            ownerId = rental.Property?.Owner?.Id,
            ownerName = rental.Property?.Owner?.UserName,
            startDate = rental.StartDate,
            endDate = rental.EndDate,
            status = rental.Status.ToString(),
        }).ToList();

        return Ok(rentalsWithDetails);
    }

    // PATCH: api/rentals/{id}/approve
    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> ApproveRental(Guid id)
    {
        var rental = await _context.Rentals
            .Include(r => r.Tenant)
            .Include(r => r.Property)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (rental == null)
        {
            return NotFound(new { message = "Hợp đồng không tìm thấy." });
        }

        if (rental.Status != RentalStatus.PendingApproval)
        {
            return BadRequest(new { message = "Hợp đồng không thể được duyệt vì không ở trạng thái chờ phê duyệt." });
        }

        rental.Status = RentalStatus.Approved;
        _context.Entry(rental).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await SendStatusUpdateEmail(rental);

            return Ok(new { message = "Hợp đồng đã được duyệt thành công và email đã được gửi." });
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi duyệt hợp đồng: " + ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi duyệt hợp đồng: " + ex.ToString() });
        }
    }

    // PATCH: api/rentals/{id}/cancel
    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> CancelRental(Guid id)
    {
        var rental = await _context.Rentals
            .Include(r => r.Tenant)
            .Include(r => r.Property)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (rental == null)
        {
            return NotFound(new { message = "Hợp đồng không tìm thấy." });
        }

        if (rental.Status == RentalStatus.ContractCanceled)
        {
            return BadRequest(new { message = "Hợp đồng đã bị huỷ." });
        }

        rental.Status = RentalStatus.ContractCanceled;
        _context.Entry(rental).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await SendCancellationEmail(rental);

            return Ok(new { message = "Hợp đồng đã bị huỷ và email thông báo đã được gửi." });
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi huỷ hợp đồng: " + ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Có lỗi xảy ra khi huỷ hợp đồng: " + ex.ToString() });
        }
    }
    private async Task SendStatusUpdateEmail(Rental rental)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");
        string smtpServer = emailSettings["SmtpServer"];
        int port = int.Parse(emailSettings["Port"]);
        string senderName = emailSettings["SenderName"];
        string senderEmail = emailSettings["SenderEmail"];
        string password = emailSettings["Password"];

        string tenantEmail = rental.Tenant.Email;
        string subject = $"Cập nhật trạng thái hợp đồng thuê: {rental.Id}";
        string body = $"Xin chào {rental.Tenant.UserName},\n\n" +
                      $"Hợp đồng thuê bất động sản '{rental.Property.Address}' của bạn đã được duyệt.\n\n" +
                      "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!\n\nTrân trọng,\nĐội ngũ Team quản lý bất động sản";

        using (var smtpClient = new SmtpClient(smtpServer)
        {
            Port = port,
            Credentials = new NetworkCredential(senderEmail, password),
            EnableSsl = true,
        })
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail, senderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = false,
            };
            mailMessage.To.Add(tenantEmail);

            try
            {
                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi gửi email: " + ex.Message);
            }
        }
    }
    private async Task SendCancellationEmail(Rental rental)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");
        string smtpServer = emailSettings["SmtpServer"];
        int port = int.Parse(emailSettings["Port"]);
        string senderName = emailSettings["SenderName"];
        string senderEmail = emailSettings["SenderEmail"];
        string password = emailSettings["Password"];

        string tenantEmail = rental.Tenant.Email;
        string subject = $"Cập nhật trạng thái hợp đồng thuê: {rental.Id}";
        string body = $"Xin chào {rental.Tenant.UserName},\n\n" +
                      $"Rất tiếc, hợp đồng thuê bất động sản '{rental.Property.Address}' của bạn đã bị huỷ.\n\n" +
                      "Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.\n\nTrân trọng,\nĐội ngũ quản lý bất động sản";

        using (var smtpClient = new SmtpClient(smtpServer)
        {
            Port = port,
            Credentials = new NetworkCredential(senderEmail, password),
            EnableSsl = true,
        })
        {
            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail, senderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = false,
            };
            mailMessage.To.Add(tenantEmail);

            try
            {
                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi gửi email: " + ex.Message);
            }
        }
    }


}
