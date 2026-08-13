import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class Rating {
    id: string;
    userId: string;
    user: User;
    storeId: string;
    store: Store;
    value: number;
    createdAt: Date;
    updatedAt: Date;
}
