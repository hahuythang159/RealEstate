import { v4 as uuidv4 } from 'uuid';

export class User {
    constructor(id = uuidv4(), userName, passwordHash, role, email, phoneNumber, isTwoFactorEnabled, isActive) {
        this.id = id;
        this.userName = userName;
        this.passwordHash = passwordHash;
        this.role = role;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.isTwoFactorEnabled = isTwoFactorEnabled;
        this.isActive = isActive;
    }
}
