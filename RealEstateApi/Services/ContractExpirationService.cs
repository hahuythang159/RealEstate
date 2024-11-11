using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using RealEstateApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;

public class ContractExpirationService : IHostedService, IDisposable
{
    private readonly ILogger<ContractExpirationService> _logger;
    private readonly IOptions<EmailSettings> _emailSettings;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private Timer _timer;

    public ContractExpirationService(
        ILogger<ContractExpirationService> logger,
        IOptions<EmailSettings> emailSettings,
        IServiceScopeFactory serviceScopeFactory)
    {
        _logger = logger;
        _emailSettings = emailSettings;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Cài đặt Timer để kiểm tra định kỳ (ví dụ mỗi ngày)
        _timer = new Timer(SendExpirationNotifications, null, TimeSpan.Zero, TimeSpan.FromDays(1));
        return Task.CompletedTask;
    }

    private async void SendExpirationNotifications(object state)
    {
        // Tạo scope mới để có thể tiêm RealEstateContext (scoped service)
        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<RealEstateContext>();
            var today = DateTime.Now;
            var expireSoon = await context.Rentals
                .Where(r => r.EndDate <= today.AddDays(7) && r.Status == RentalStatus.Approved)  // Các hợp đồng hết hạn trong vòng 7 ngày
                .Include(r => r.Tenant)
                .Include(r => r.Property)
                .ToListAsync();

            foreach (var rental in expireSoon)
            {
                await SendExpirationEmail(rental);
            }
        }
    }

    private async Task SendExpirationEmail(Rental rental)
    {
        var emailSettings = _emailSettings.Value;
        string smtpServer = emailSettings.SmtpServer;
        int port = emailSettings.Port;
        string senderName = emailSettings.SenderName;
        string senderEmail = emailSettings.SenderEmail;
        string password = emailSettings.Password;

        string tenantEmail = rental.Tenant.Email;
        string subject = $"Hợp đồng thuê sắp hết hạn: {rental.Id}";
        string body = $"Xin chào {rental.Tenant.UserName},\n\n" +
                      $"Hợp đồng thuê bất động sản '{rental.Property.Address}' của bạn sẽ hết hạn vào {rental.EndDate:dd/MM/yyyy}.\n\n" +
                      "Xin vui lòng liên hệ với chúng tôi nếu bạn muốn gia hạn hợp đồng.\n\n" +
                      "Trân trọng,\nĐội ngũ quản lý bất động sản";

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
                _logger.LogInformation($"Đã gửi email thông báo hết hạn hợp đồng cho người thuê: {rental.Tenant.UserName}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Lỗi khi gửi email cho người thuê {rental.Tenant.UserName}: {ex.Message}");
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
