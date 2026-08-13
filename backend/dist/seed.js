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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = runSeed;
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./users/entities/user.entity");
const store_entity_1 = require("./stores/entities/store.entity");
async function runSeed(dataSource) {
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const storeRepository = dataSource.getRepository(store_entity_1.Store);
    console.log('Seeding data...');
    const passwordHashAdmin = await bcrypt.hash('Admin@1234', 10);
    const passwordHashOwner = await bcrypt.hash('Owner@1234', 10);
    const passwordHashUser = await bcrypt.hash('User@1234', 10);
    let admin = await userRepository.findOneBy({ email: 'admin@storerating.local' });
    if (!admin) {
        admin = userRepository.create({
            name: 'Platform System Administrator Account',
            email: 'admin@storerating.local',
            passwordHash: passwordHashAdmin,
            address: 'HQ Office, Platform Admin Address, City, State',
            role: user_entity_1.UserRole.ADMIN,
        });
        await userRepository.save(admin);
        console.log('Created admin user');
    }
    let owner = await userRepository.findOneBy({ email: 'owner@storerating.local' });
    if (!owner) {
        owner = userRepository.create({
            name: 'Default Store Owner Account Holder',
            email: 'owner@storerating.local',
            passwordHash: passwordHashOwner,
            address: '123 Market Street, Sample City, State',
            role: user_entity_1.UserRole.STORE_OWNER,
        });
        await userRepository.save(owner);
        console.log('Created owner user');
    }
    let user = await userRepository.findOneBy({ email: 'user@storerating.local' });
    if (!user) {
        user = userRepository.create({
            name: 'Sample Normal User Account Holder',
            email: 'user@storerating.local',
            passwordHash: passwordHashUser,
            address: '456 Residential Lane, Sample City, State',
            role: user_entity_1.UserRole.NORMAL_USER,
        });
        await userRepository.save(user);
        console.log('Created normal user');
    }
    let store = await storeRepository.findOneBy({ email: 'store@storerating.local' });
    if (!store && owner) {
        store = storeRepository.create({
            name: 'Sample Grocery Store Downtown',
            email: 'store@storerating.local',
            address: '789 Commerce Ave, Sample City, State',
            ownerId: owner.id,
        });
        await storeRepository.save(store);
        console.log('Created sample store');
    }
    console.log('Seeding complete.');
}
//# sourceMappingURL=seed.js.map