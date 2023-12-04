import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SynoBotModule } from './synobot/synobot.module';




@Module({
  imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		SynoBotModule,
	],
})
export class AppModule {}
