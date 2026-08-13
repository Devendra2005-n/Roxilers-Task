import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UserRole } from '../users/entities/user.entity';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
    createUser(dto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
    createStore(dto: CreateStoreDto): Promise<import("../stores/entities/store.entity").Store>;
    getUsers(query: any): Promise<{
        data: import("../users/entities/user.entity").User[];
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
        role: UserRole;
        ownedStore?: import("../stores/entities/store.entity").Store;
        ratings: import("../ratings/entities/rating.entity").Rating[];
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateUser(id: string, dto: UpdateUserDto): Promise<import("../users/entities/user.entity").User>;
    updateStore(id: string, dto: UpdateStoreDto): Promise<import("../stores/entities/store.entity").Store>;
}
