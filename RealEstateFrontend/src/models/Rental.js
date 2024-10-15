import { v4 as uuidv4 } from 'uuid';

export class Rental {
    constructor(id = uuidv4(), propertyId, tenantId, startDate, endDate, status) {
        this.id = id;
        this.propertyId = propertyId;
        this.tenantId = tenantId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}
