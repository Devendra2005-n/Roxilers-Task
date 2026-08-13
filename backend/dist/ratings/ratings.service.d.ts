import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';
export declare class RatingsService {
    private ratingsRepository;
    constructor(ratingsRepository: Repository<Rating>);
    submitRating(storeId: string, userId: string, value: number): Promise<Rating>;
    updateRating(storeId: string, userId: string, value: number): Promise<Rating>;
}
