import { Controller } from '@nestjs/common';
import { PogodaService } from './pogoda.service';

@Controller('pogoda')
export class PogodaController {
  constructor(private readonly pogodaService: PogodaService) {}
}
