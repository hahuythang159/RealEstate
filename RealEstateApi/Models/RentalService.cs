using System.Threading.Tasks;
using RealEstateApi.Models;

public class RentalService
{
    private readonly RealEstateContext _context;
    private readonly EmailService _emailService;

    public RentalService(RealEstateContext context, EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task UpdateRentalStatus(Guid rentalId, RentalStatus newStatus)
    {
        var rental = await _context.Rentals.FindAsync(rentalId);
        if (rental != null && rental.Status != newStatus)
        {
            rental.Status = newStatus;
            if (newStatus == RentalStatus.Approved && rental.Tenant != null)
            {
                string subject = "Rental Approved";
                string body = $"Your rental request for property {rental.Property?.Address} has been approved.";
                await _emailService.SendEmailAsync(rental.Tenant.Email, subject, body);
            }

            _context.Rentals.Update(rental);
            await _context.SaveChangesAsync();
        }
    }
}
