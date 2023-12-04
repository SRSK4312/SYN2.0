import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { _logger } from './helpers/_logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
		bufferLogs: true
	});
	app.setGlobalPrefix('api')
  await app.listen(5555);
}
bootstrap();
