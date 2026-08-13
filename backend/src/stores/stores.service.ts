import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    private dataSource: DataSource,
  ) {}

  async findAll(query: {
    search?: string; sortBy?: string; order?: 'ASC' | 'DESC'; page?: number; limit?: number;
  }) {
    const allowedSort = ['name', 'address', 'average_rating', 'created_at'];
    const sortBy = query.sortBy && allowedSort.includes(query.sortBy) ? query.sortBy : 'name';
    const order = query.order === 'DESC' ? 'DESC' : 'ASC';
    const page = query.page ? Number(query.page) : 1;
    const limit = Math.min(query.limit ? Number(query.limit) : 10, 100);

    const qb = this.dataSource
      .createQueryBuilder()
      .select('s.*')
      .addSelect('COALESCE(AVG(r.value), 0)', 'average_rating')
      .addSelect('COUNT(r.id)', 'total_ratings')
      .from('stores', 's')
      .leftJoin('ratings', 'r', 'r.store_id = s.id')
      .groupBy('s.id')
      .orderBy(sortBy === 'average_rating' ? 'average_rating' : `s.${sortBy}`, order)
      .offset((page - 1) * limit)
      .limit(limit);

    if (query.search) {
      qb.andWhere('(s.name LIKE :search OR s.address LIKE :search)', { search: `%${query.search}%` });
    }

    const rawData = await qb.getRawMany();
    
    const countQb = this.dataSource.createQueryBuilder()
      .select('COUNT(DISTINCT s.id)', 'count')
      .from('stores', 's');
      
    if (query.search) {
      countQb.andWhere('(s.name LIKE :search OR s.address LIKE :search)', { search: `%${query.search}%` });
    }
    const countResult = await countQb.getRawOne();

    return {
      data: rawData.map(d => ({
        ...d,
        averageRating: Number(d.average_rating) || 0,
        totalRatings: Number(d.total_ratings) || 0,
      })),
      total: Number(countResult.count),
      page,
      limit,
    };
  }

  async create(data: any) {
    const store = this.storesRepository.create(data);
    return this.storesRepository.save(store);
  }
}
