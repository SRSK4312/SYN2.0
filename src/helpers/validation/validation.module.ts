import { Module, Global } from '@nestjs/common';
import { AuthValidService } from './services/auth-valid.service';
import { OrderValidService } from './services/order-valid.service';

@Global()
@Module({
  providers: [AuthValidService, OrderValidService],
	exports: [AuthValidService, OrderValidService]
})
export class ValidationModule {}