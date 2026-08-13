"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const store_entity_1 = require("../stores/entities/store.entity");
const typeorm_2 = require("typeorm");
let OwnerService = class OwnerService {
    storesRepository;
    dataSource;
    constructor(storesRepository, dataSource) {
        this.storesRepository = storesRepository;
        this.dataSource = dataSource;
    }
    async getDashboard(ownerId) {
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
};
exports.OwnerService = OwnerService;
exports.OwnerService = OwnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], OwnerService);
//# sourceMappingURL=owner.service.js.map