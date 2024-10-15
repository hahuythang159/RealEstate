import { v4 as uuidv4 } from 'uuid';

export class Comment {
    constructor(id = uuidv4(), propertyId, userId, content, createdAt) {
        this.id = id;
        this.propertyId = propertyId;
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
    }
}
