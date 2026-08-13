import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
export declare class AdminService {
    private usersRepository;
    private storesRepository;
    private ratingsRepository;
    private dataSource;
    constructor(usersRepository: Repository<User>, storesRepository: Repository<Store>, ratingsRepository: Repository<Rating>, dataSource: DataSource);
    getDashboard(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
    createUser(dto: CreateUserDto): Promise<User>;
    createStore(dto: CreateStoreDto): Promise<Store>;
    getUsers(query: {
        search?: string;
        sortBy?: string;
        order?: 'ASC' | 'DESC';
        page?: number;
        limit?: number;
    }): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUser(id: string): Promise<{
        rating: number | null;
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        address: string;
        role: import("../users/entities/user.entity").UserRole;
        ownedStore?: Store;
        ratings: Rating[];
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateUser(id: string, dto: UpdateUserDto): Promise<User>;
    updateStore(id: string, dto: UpdateStoreDto): Promise<Store>;
}
