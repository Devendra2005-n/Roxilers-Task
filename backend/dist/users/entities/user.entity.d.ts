import { Store } from '../../stores/entities/store.entity';
import { Rating } from '../../ratings/entities/rating.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    NORMAL_USER = "NORMAL_USER",
    STORE_OWNER = "STORE_OWNER"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    address: string;
    role: UserRole;
    ownedStore?: Store;
    ratings: Rating[];
    createdAt: Date;
    updatedAt: Date;
}
