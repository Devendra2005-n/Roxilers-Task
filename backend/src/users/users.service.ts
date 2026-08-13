import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(signupDto: SignupDto): Promise<User> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(signupDto.password, saltRounds);
    
    const user = this.usersRepository.create({
      name: signupDto.name,
      email: signupDto.email,
      passwordHash,
      address: signupDto.address,
      role: UserRole.NORMAL_USER,
    });
    
    return this.usersRepository.save(user);
  }
  
  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
