import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { ItemEntity } from './entity/item.entity';
import { ScanDataEntity } from './entity/scanData.entity';
import { TypeOrmConfigService } from './typeOrmConfig.service';
import { DataBaseService } from './database.service';

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
		}),
		TypeOrmModule.forFeature([OrderEntity, ItemEntity, ScanDataEntity ])
	],
  providers: [DataBaseService],
	exports: [DataBaseService]
})
export class DataBaseModule {}
