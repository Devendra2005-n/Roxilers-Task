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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const store_entity_1 = require("./entities/store.entity");
const typeorm_2 = require("typeorm");
let StoresService = class StoresService {
    storesRepository;
    dataSource;
    constructor(storesRepository, dataSource) {
        this.storesRepository = storesRepository;
        this.dataSource = dataSource;
    }
    async findAll(query) {
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
    async create(data) {
        const store = this.storesRepository.create(data);
        return this.storesRepository.save(store);
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], StoresService);
//# sourceMappingURL=stores.service.js.map