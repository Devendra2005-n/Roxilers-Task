import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignupDto } from '../auth/dto/signup.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOneByEmail(email: string): Promise<User | null>;
    findOne(id: string): Promise<User | null>;
    create(signupDto: SignupDto): Promise<User>;
    save(user: User): Promise<User>;
}
