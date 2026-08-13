import { UserRole } from '../../users/entities/user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    address: string;
    role: UserRole;
    storeId?: string;
}
