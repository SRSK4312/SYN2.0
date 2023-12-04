import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { env } from "process";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
			"type": "mssql",
			"host": env.DB_HOST,
			"port": +env.DB_PORT,
			"username": env.DB_USER,
			"password": env.DB_PWD,
			"database": env.DB_NAME,
			"logging": true,
			"entities": ["dist/**/*.entity{.ts,.js}"],
			"options": {
				"encrypt": false
			},
			"synchronize": false,
		}
  }
}