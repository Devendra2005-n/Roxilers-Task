import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Store) private storesRepository: Repository<Store>,
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
    private dataSource: DataSource,
  ) {}

  async getDashboard() {
    const totalUsers = await this.usersRepository.count();
    const totalStores = await this.storesRepository.count();
    const totalRatings = await this.ratingsRepository.count();
    return { totalUsers, totalStores, totalRatings };
  }

  async createUser(dto: CreateUserDto) {
    const existing = await this.usersRepository.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('Email already exists');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = this.usersRepository.create({
      ...dto,
      passwordHash,
    });
    const savedUser = await this.usersRepository.save(user);

    if (dto.storeId && dto.role === 'STORE_OWNER') {
      const store = await this.storesRepository.findOneBy({ id: dto.storeId });
      if (store) {
        store.ownerId = savedUser.id;
        await this.storesRepository.save(store);
      }
    }

    return savedUser;
  }

  async createStore(dto: CreateStoreDto) {
    if (dto.ownerId) {
       const store = await this.storesRepository.findOneBy({ ownerId: dto.ownerId });
       if (store) throw new ConflictException('Owner already has a store');
    }
    const store = this.storesRepository.create(dto);
    return this.storesRepository.save(store);
  }

  async getUsers(query: { search?: string; sortBy?: string; order?: 'ASC'|'DESC'; page?: number; limit?: number }) {
    const qb = this.usersRepository.createQueryBuilder('u');
    if (query.search) {
      qb.where('u.name LIKE :search OR u.email LIKE :search', { search: `%${query.search}%` });
    }
    const sortBy = query.sortBy || 'name';
    const order = query.order === 'DESC' ? 'DESC' : 'ASC';
    const page = query.page ? Number(query.page) : 1;
    const limit = Math.min(query.limit ? Number(query.limit) : 10, 100);

    qb.orderBy(`u.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit);
      
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async getUser(id: string) {
    const user = await this.usersRepository.findOne({ where: { id }, relations: { ownedStore: true } });
    if (!user) return null;
    let rating = null;
    if (user.role === 'STORE_OWNER' && user.ownedStore) {
       const res = await this.dataSource.createQueryBuilder()
        .select('AVG(r.value)', 'avg')
        .from('ratings', 'r')
        .where('r.store_id = :storeId', { storeId: user.ownedStore.id })
        .getRawOne();
       rating = Number(res?.avg || 0);
    }
    return { ...user, rating };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepository.findOneBy({ email: dto.email });
      if (existing) throw new ConflictException('Email already exists');
    }

    if (dto.password) {
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
      user.passwordHash = await bcrypt.hash(dto.password, saltRounds);
    }

    Object.assign(user, {
      ...(dto.name && { name: dto.name }),
      ...(dto.email && { email: dto.email }),
      ...(dto.address && { address: dto.address }),
      ...(dto.role && { role: dto.role }),
    });

    const savedUser = await this.usersRepository.save(user);

    if (dto.storeId && savedUser.role === 'STORE_OWNER') {
      const store = await this.storesRepository.findOneBy({ id: dto.storeId });
      if (store) {
        store.ownerId = savedUser.id;
        await this.storesRepository.save(store);
      }
    }

    return savedUser;
  }

  async updateStore(id: string, dto: UpdateStoreDto) {
    const store = await this.storesRepository.findOneBy({ id });
    if (!store) throw new NotFoundException('Store not found');

    if (dto.ownerId && dto.ownerId !== store.ownerId) {
       const existingStore = await this.storesRepository.findOneBy({ ownerId: dto.ownerId });
       if (existingStore) throw new ConflictException('Owner already has a store');
    }

    Object.assign(store, {
      ...(dto.name && { name: dto.name }),
      ...(dto.email && { email: dto.email }),
      ...(dto.address && { address: dto.address }),
      ...(dto.ownerId !== undefined && { ownerId: dto.ownerId || null }),
    });

    return this.storesRepository.save(store);
  }
}
