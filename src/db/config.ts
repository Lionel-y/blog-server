import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log(process.env);

export const DBConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 3306,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: ['./entities/*.entity.ts'],
};
