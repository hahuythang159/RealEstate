import { v4 as uuidv4 } from 'uuid';

export class Property {
    constructor(id = uuidv4(),title, address, description, price, ownerId, provinceId, districtId, wardId, imageUrl, bedrooms, bathrooms, area, propertyType, usageType, interior) {
        this.id = id;
        this.title=title;
        this.address = address;
        this.description = description;
        this.price = price;
        this.ownerId = ownerId;
        this.provinceId = provinceId; 
        this.districtId = districtId; 
        this.wardId = wardId; 
        this.imageUrl = imageUrl;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.area = area;
        this.propertyType = propertyType;
        this.usageType = usageType;
        this.interior=interior;
    }
}
