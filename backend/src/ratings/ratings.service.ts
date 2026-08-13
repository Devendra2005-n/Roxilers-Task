import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingsRepository: Repository<Rating>,
  ) {}

  async submitRating(storeId: string, userId: string, value: number) {
    const existing = await this.ratingsRepository.findOneBy({ storeId, userId });
    if (existing) {
       throw new ConflictException('You have already rated this store. Please update your rating instead.');
    }
    const rating = this.ratingsRepository.create({ storeId, userId, value });
    return this.ratingsRepository.save(rating);
  }

  async updateRating(storeId: string, userId: string, value: number) {
    const existing = await this.ratingsRepository.findOneBy({ storeId, userId });
    if (!existing) {
       throw new ConflictException('Rating not found. Please submit a rating first.');
    }
    existing.value = value;
    return this.ratingsRepository.save(existing);
  }
}
