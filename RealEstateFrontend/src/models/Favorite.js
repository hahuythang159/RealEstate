import { v4 as uuidv4 } from 'uuid';

export class Favorite {
    constructor(id = uuidv4(), userId, propertyId) {
        this.id = id;
        this.userId = userId;
        this.propertyId = propertyId;
    }
}
