using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class ChatHub : Hub
{
    private static Dictionary<string, string> connectedUsers = new Dictionary<string, string>();

    public override async Task OnConnectedAsync()
    {
        var userId = Context.ConnectionId;
        connectedUsers[userId] = Context.UserIdentifier;

        // Thông báo tới tất cả mọi người rằng user đã kết nối
        await Clients.All.SendAsync("UserConnected", Context.UserIdentifier);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var userId = Context.ConnectionId;

        // Xóa người dùng đã ngắt kết nối
        connectedUsers.Remove(userId);

        // Thông báo tới tất cả mọi người rằng user đã ngắt kết nối
        await Clients.All.SendAsync("UserDisconnected", Context.UserIdentifier);

        await base.OnDisconnectedAsync(exception);
    }
}

