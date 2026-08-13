import { User } from '../../users/entities/user.entity';
import { Rating } from '../../ratings/entities/rating.entity';
export declare class Store {
    id: string;
    name: string;
    email: string;
    address: string;
    ownerId?: string;
    owner?: User;
    ratings: Rating[];
    createdAt: Date;
    updatedAt: Date;
}
