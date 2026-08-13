import { Store } from '../stores/entities/store.entity';
import { Repository, DataSource } from 'typeorm';
export declare class OwnerService {
    private storesRepository;
    private dataSource;
    constructor(storesRepository: Repository<Store>, dataSource: DataSource);
    getDashboard(ownerId: string): Promise<{
        store: null;
        averageRating: number;
        totalRatings: number;
    } | {
        store: Store;
        averageRating: number;
        totalRatings: number;
    }>;
}
