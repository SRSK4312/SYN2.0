import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DataBaseModule } from '../../database/database.module';
import { ValidationModule } from 'src/helpers/validation/validation.module';



@Module({
	imports: [
		DataBaseModule,
		ValidationModule
	],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
