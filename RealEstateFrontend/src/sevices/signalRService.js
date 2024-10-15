// src/services/signalRService.js

import { HubConnectionBuilder } from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl('/commentHub') // Đường dẫn đến Hub
            .build();

        this.connection.on('ReceiveComment', (propertyId, user, comment) => {
            // Gọi hàm callback khi nhận bình luận
            this.onReceiveComment(propertyId, user, comment);
        });
    }

    async start() {
        try {
            await this.connection.start();
            console.log('SignalR Connected.');
        } catch (err) {
            console.error('Error while starting connection: ' + err);
        }
    }

    async sendComment(propertyId, user, comment) {
        await this.connection.invoke('SendComment', propertyId, user, comment);
    }

    onReceiveComment(propertyId, user, comment) {
        // Hàm này sẽ được định nghĩa trong component của bạn
    }

    setReceiveCommentCallback(callback) {
        this.onReceiveComment = callback;
    }
}

const signalRService = new SignalRService();
export default signalRService;
