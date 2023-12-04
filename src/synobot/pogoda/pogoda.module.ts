import { Module } from '@nestjs/common';
import { PogodaService } from './pogoda.service';
import { PogodaController } from './pogoda.controller';

@Module({
  controllers: [PogodaController],
  providers: [PogodaService],
})
export class PogodaModule {}
