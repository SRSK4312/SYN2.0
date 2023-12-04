import { Body, Controller, Post } from '@nestjs/common';
import { SynoBotService } from './synobot.service';
import { synobot_Req } from './synobot.dto';

@Controller('synobot')
export class SynoBotController {
  constructor(private readonly sinobotService: SynoBotService) {}

	@Post()
		getAsk(@Body() request) {
			return  this.sinobotService.getAnswer(request)
		}
}
