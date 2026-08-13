import { RatingsService } from './ratings.service';
import { SubmitRatingDto } from './dto/submit-rating.dto';
export declare class RatingsController {
    private ratingsService;
    constructor(ratingsService: RatingsService);
    submitRating(storeId: string, req: any, dto: SubmitRatingDto): Promise<import("./entities/rating.entity").Rating>;
    updateRating(storeId: string, req: any, dto: SubmitRatingDto): Promise<import("./entities/rating.entity").Rating>;
}
