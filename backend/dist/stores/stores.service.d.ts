import { Store } from './entities/store.entity';
import { Repository, DataSource } from 'typeorm';
export declare class StoresService {
    private storesRepository;
    private dataSource;
    constructor(storesRepository: Repository<Store>, dataSource: DataSource);
    findAll(query: {
        search?: string;
        sortBy?: string;
        order?: 'ASC' | 'DESC';
        page?: number;
        limit?: number;
    }): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: any): Promise<Store[]>;
}
