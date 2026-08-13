import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './users/entities/user.entity';
import { Store } from './stores/entities/store.entity';

export async function runSeed(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const storeRepository = dataSource.getRepository(Store);

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
      role: UserRole.ADMIN,
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
      role: UserRole.STORE_OWNER,
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
      role: UserRole.NORMAL_USER,
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
