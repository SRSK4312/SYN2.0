import { Injectable, Logger } from '@nestjs/common';

import { env } from 'process';
import { synobot_Req } from '../synobot.dto';
import { openWeatherResponse, filteredPogodaData } from './pogoda.dto';
import { _Error } from 'src/helpers/_error.service';



@Injectable()
export class PogodaService {
	private readonly logger = new Logger(PogodaService.name)

	private openWeatherData = new openWeatherResponse;
	private resultTXT: string

	async createAnswer():Promise<string> {
		// Возврат уже имеющихся данный, которые были получены в течении 15 мин.
		if (this.openWeatherData.dt) {
			const now = new Date().getTime() / 1000
			const deltaTime = (now - this.openWeatherData.dt)/ 60 
			if (deltaTime <= 15) return this.resultTXT
		}

		await this.fetchOpenWeather()
		let filteredData = this.validOpenWeather(this.openWeatherData)
		// this.logger.debug(JSON.stringify(filteredData, null, 2))
		
		this.resultTXT = ''
		this.resultTXT += `На сегодня, ${new Date().toLocaleString('ru', {year: 'numeric',	month: 'long',day: 'numeric'})}, в гор. Кирово-Чепецке\n`
		this.resultTXT += `Температура: ${filteredData.temperature} °С, ощущается как: ${filteredData.feels_like} °С\n`
		this.resultTXT += `  Погодные условия: ${filteredData.description}\n`
		this.resultTXT += `  Скорость ветра: ${filteredData.wind_speed} м/c\n`
		this.resultTXT += `  Влажность: ${filteredData.humidity} %\n`
		this.resultTXT += `  Восход: ${filteredData.sunrise}  Закат: ${filteredData.sunset}`

		return this.resultTXT
	}


	private async fetchOpenWeather(){
		// this.logger.debug('fetchOpenWeather new DATA')
		try {
			await fetch (env.WEATHER_API_FULLURL).then(res => res.json()).then((data) => {
				this.openWeatherData = data as openWeatherResponse
			})
		} catch (e) {
			const error = new _Error(
				'DEx0001',
				e.stack ? e.stack : this.fetchOpenWeather.name,
				e.message ? e.message : ''
			)
			throw error
		}
	}
	

	private validOpenWeather(data: openWeatherResponse){
		// this.logger.debug('validOpenWeather active')
		const filteredData: filteredPogodaData = {
			temperature: Math.round(data.main.temp),
			feels_like: Math.round(data.main.feels_like),
			humidity: data.main.humidity,
			wind_speed: data.wind.speed,
			description: data.weather[0].description.charAt(0).toUpperCase() + this.openWeatherData.weather[0].description.slice(1),
			sunset: new Date (data.sys.sunset * 1000).toLocaleString('ru', {hour: 'numeric', minute: 'numeric'}),
			sunrise: new Date (data.sys.sunrise * 1000).toLocaleString('ru', {hour: 'numeric', minute: 'numeric'})
		}
		return filteredData
	}

	
}
