import { Injectable, Logger } from '@nestjs/common';
import { synobot_Req } from './synobot.dto';
import { env } from 'process';

import { OrderService } from './order/order.service';

import { _Error } from 'src/helpers/_error.service';
import { OrderValidService } from 'src/helpers/validation/services/order-valid.service';
import { PogodaService } from './pogoda/pogoda.service';



@Injectable()
export class SynoBotService {
	constructor(
		private pogodaService: PogodaService,
		private orderValid: OrderValidService,
		private orderService: OrderService
	){}
	
	private readonly logger = new Logger(SynoBotService.name)
	private resultTXT:synobot_Req

	async getAnswer(sinoBotReq: synobot_Req){
		this.resultTXT = {text: ''}

		this.logger.debug('\n----- SYNOLOGYBOT REQUERS -----\n' + JSON.stringify(sinoBotReq, null, 2))

		// Проверка токена (Сделать модуль авторизации)
		if (sinoBotReq.token != env.SINOBOT_API_KEY){
			if (sinoBotReq.token != env.COMMAND_POGODA_KEY) {
				const error = new _Error('AEx0001', this.getAnswer.name)
				this.logger.error(`${error.stack}: ${error.sys}`)
				this.resultTXT.text = error.message
				return this.resultTXT
			}
		} 
		
		const reqTXT = sinoBotReq.text.toLowerCase().trim()
		const defaultAnsw = `:question: Для того чтобы узнать погоду напиши мне "погода" или в любом другом диалоге "/pogoda\n:question: Для того что бы узнать статус заказа напиши мне его номер и я постараюсь тебе помочь.`

		// Обработка запроса
		switch(true) {
			// Приветствие
			case (reqTXT === 'привет' || reqTXT === 'hello' || reqTXT === 'hi'):
				this.resultTXT.text = 'Привет. :wave: Я твой небольшой помощник. :nerd:\n' + defaultAnsw
				break;

			// Погода 
			case (reqTXT === 'погода' || reqTXT === 'pogoda' || reqTXT === '/pogoda'):
				try {
					await this.pogodaService.createAnswer().then(pogodaTXT => {
						this.resultTXT.text = pogodaTXT
					})
				} catch (error) {
					this.logger.error(`${error.stack}: ${error.sys}`)
					this.resultTXT.text = error.message
				}
				break;

			// Заказы
			case (this.orderValid.validTaskNo(reqTXT) || this.orderValid.validOrderNo(reqTXT)) :
				try {
					await this.orderService.getOrderStatus(reqTXT).then( orderInfo => {
						this.resultTXT.text = orderInfo
					})
				} catch (error) {
					this.logger.error(`${error.stack}: ${error.sys}`)
					this.resultTXT.text = error.message
				}
				break;
			
			// Дефолтный ответ
			default:
				this.resultTXT.text = defaultAnsw
				break;
		}

		this.logger.debug('\n------- RESULT TXT -------\n' + this.resultTXT.text);
		return this.resultTXT
	}
}
