import { v4 as uuidv4 } from 'uuid';

export class Booking {
    constructor(id = uuidv4(), propertyId, userId, bookingDate, startDate, endDate, status) {
        this.id = id;
        this.propertyId = propertyId;
        this.userId = userId;
        this.bookingDate = bookingDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}
