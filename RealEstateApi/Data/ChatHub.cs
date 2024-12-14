using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class ChatHub : Hub
{
    public async Task SendMessageToAll(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", message);
    }

    public async Task SendMessageToOwner(string ownerId, string message)
    {
        await Clients.User(ownerId).SendAsync("ReceiveNotification", message);
    }
}
