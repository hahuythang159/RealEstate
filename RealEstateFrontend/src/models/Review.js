import { v4 as uuidv4 } from 'uuid';

export class Review {
    constructor(id = uuidv4(), propertyId, userId, rating, comment, createdAt) {
        this.id = id;
        this.propertyId = propertyId;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }
}
