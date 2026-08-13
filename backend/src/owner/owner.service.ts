import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../stores/entities/store.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Store) private storesRepository: Repository<Store>,
    private dataSource: DataSource,
  ) {}

  async getDashboard(ownerId: string) {
    const store = await this.storesRepository.findOneBy({ ownerId });
    if (!store) {
      return { store: null, averageRating: 0, totalRatings: 0 };
    }
    
    const res = await this.dataSource.createQueryBuilder()
      .select('COALESCE(AVG(r.value), 0)', 'average_rating')
      .addSelect('COUNT(r.id)', 'total_ratings')
      .from('ratings', 'r')
      .where('r.store_id = :storeId', { storeId: store.id })
      .getRawOne();
      
    return {
      store,
      averageRating: Number(res.average_rating) || 0,
      totalRatings: Number(res.total_ratings) || 0,
    };
  }
}
