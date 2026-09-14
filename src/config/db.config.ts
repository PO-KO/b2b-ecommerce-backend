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
  url: 'ENV_FILE',
  autoLoadEntities: true,
  // Production synchronize = false
  synchronize: true,
};
