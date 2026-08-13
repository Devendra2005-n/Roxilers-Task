import { OwnerService } from './owner.service';
export declare class OwnerController {
    private ownerService;
    constructor(ownerService: OwnerService);
    getDashboard(req: any): Promise<{
        store: null;
        averageRating: number;
        totalRatings: number;
    } | {
        store: import("../stores/entities/store.entity").Store;
        averageRating: number;
        totalRatings: number;
    }>;
}
