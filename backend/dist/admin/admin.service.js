"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const rating_entity_1 = require("../ratings/entities/rating.entity");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    usersRepository;
    storesRepository;
    ratingsRepository;
    dataSource;
    constructor(usersRepository, storesRepository, ratingsRepository, dataSource) {
        this.usersRepository = usersRepository;
        this.storesRepository = storesRepository;
        this.ratingsRepository = ratingsRepository;
        this.dataSource = dataSource;
    }
    async getDashboard() {
        const totalUsers = await this.usersRepository.count();
        const totalStores = await this.storesRepository.count();
        const totalRatings = await this.ratingsRepository.count();
        return { totalUsers, totalStores, totalRatings };
    }
    async createUser(dto) {
        const existing = await this.usersRepository.findOneBy({ email: dto.email });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
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
    async createStore(dto) {
        if (dto.ownerId) {
            const store = await this.storesRepository.findOneBy({ ownerId: dto.ownerId });
            if (store)
                throw new common_1.ConflictException('Owner already has a store');
        }
        const store = this.storesRepository.create(dto);
        return this.storesRepository.save(store);
    }
    async getUsers(query) {
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
    async getUser(id) {
        const user = await this.usersRepository.findOne({ where: { id }, relations: { ownedStore: true } });
        if (!user)
            return null;
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
    async updateUser(id, dto) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.email && dto.email !== user.email) {
            const existing = await this.usersRepository.findOneBy({ email: dto.email });
            if (existing)
                throw new common_1.ConflictException('Email already exists');
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
    async updateStore(id, dto) {
        const store = await this.storesRepository.findOneBy({ id });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        if (dto.ownerId && dto.ownerId !== store.ownerId) {
            const existingStore = await this.storesRepository.findOneBy({ ownerId: dto.ownerId });
            if (existingStore)
                throw new common_1.ConflictException('Owner already has a store');
        }
        Object.assign(store, {
            ...(dto.name && { name: dto.name }),
            ...(dto.email && { email: dto.email }),
            ...(dto.address && { address: dto.address }),
            ...(dto.ownerId !== undefined && { ownerId: dto.ownerId || null }),
        });
        return this.storesRepository.save(store);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AdminService);
//# sourceMappingURL=admin.service.js.map