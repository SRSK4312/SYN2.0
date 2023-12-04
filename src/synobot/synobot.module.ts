import { Module } from '@nestjs/common';
import { SynoBotController } from './synobot.controller';
import { SynoBotService } from './synobot.service';

import { PogodaModule } from './pogoda/pogoda.module';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';
import { ValidationModule } from 'src/helpers/validation/validation.module';
import { OrderValidService } from 'src/helpers/validation/services/order-valid.service';
import { PogodaService } from './pogoda/pogoda.service';



@Module({
	imports: [
		PogodaModule,
		OrderModule,
		ValidationModule
	],
  controllers: [SynoBotController],
  providers: [SynoBotService, OrderService, OrderValidService, PogodaService],
})
export class SynoBotModule {}
