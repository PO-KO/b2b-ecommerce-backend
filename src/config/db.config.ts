import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const getEnvVar = (envVar: any) => {
  if (!envVar) throw new Error('Required');
};

export const pgConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  // host: 'localhost',
  // port: 5432,
  // username: 'postgres',
  // password: 'postgres',
  // database: 'b2b_ecommerce',
  url: 'postgresql://neondb_owner:npg_sUHaRTPc5pk3@ep-divine-king-ayhrcxkd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  autoLoadEntities: true,
  // Production synchronize = false
  synchronize: true,
};
