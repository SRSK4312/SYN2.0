import { Injectable, Logger } from '@nestjs/common';
import { DataBaseService } from '../../database/database.service';
import { OrderEntity } from '../../database/entity/order.entity';
import { OrderValidService } from 'src/helpers/validation/services/order-valid.service';
import { _Error } from 'src/helpers/_error.service';
import { ScanDataEntity } from 'src/database/entity/scanData.entity';


@Injectable()
export class OrderService {

	constructor (
		private db: DataBaseService,
		private orderValid: OrderValidService,
	){}
	private readonly logger = new Logger(OrderService.name)
	private resultTXT: string

	async getOrderStatus (orderNo: string) {
		this.resultTXT = ''
		let orderData = [] as OrderEntity[]

		if (this.orderValid.validTaskNo(orderNo)){
			try { 
				await this.db.findOrderByTaskNo(orderNo).then( orders => orderData = orders )
			} catch (e) {
				if (e.stack === this.db.findOrderByTaskNo.name) e.stack += `--> ${this.getOrderStatus.name}`
				throw e
			}
		} else if (this.orderValid.validOrderNo(orderNo)){
			try {
				await this.db.findOrderByOrderNo(orderNo).then( orders => orderData = orders )
			} catch (e) {
				if (e.stack === this.db.findOrderByOrderNo.name) e.stack += `--> ${this.getOrderStatus.name}`
				throw e
			}
		} else {
			const error = new _Error('UEx0001', this.getOrderStatus.name)
			throw error
		}
		// this.logger.debug('\nFETCH ORDERS:' + JSON.stringify(orderData, null, 2));
	

		let orderInfo = [] as OrderEntity[]
		// Возрата ответа (Заказ не найден)
		if (!orderData.length) {
			this.resultTXT = 'Заказ не найден :thinking:\n:question: Для того чтобы узнать погоду напиши мне "погода" или в любом другом диалоге "/pogoda\n":question: Для того что бы узнать статус заказа напиши мне его номер и я постараюсь тебе помочь.'
			return this.resultTXT
		}
		else {
			// Валидация заказов (Фильтрация)
			orderData.forEach(order => {
				const _validOrder = this.orderValid.validOrderEntity(order)
				if (_validOrder) orderInfo.push(_validOrder)
			})
			// this.logger.debug('\nACTUAL ORDER: ' + JSON.stringify(orderInfo, null, 2));
		}

		// Возврат ответа только с архивными заказами
		if (orderInfo.length == 0 && orderData.length > 0){
			if (orderData.length == 1) this.resultTXT = `Нашёл один заказ в архиве *${orderData[0].OrderNo} / ${orderData[0].TaskNo}*`
			else {
				this.resultTXT += `Нашёл только заказ(ы) перенесенные в архив:\n`
				orderData.forEach((archOrder, indx) => {
					orderNo = archOrder.OrderNo + ' / ' + archOrder.TaskNo
					this.resultTXT += `    ${indx}) ${orderNo}\n`
				})
			}
			return this.resultTXT
		}

		// Непредвиденная ошибка (2 активных заказа)
		if (orderInfo.length > 1) {
			const error = new _Error('UEx0002', this.getOrderStatus.name, JSON.stringify(orderInfo, null, 2))
			throw error
		} else if (!orderInfo.length){
			// Непредвиденная ошибка (0 активных заказов)
			const error = new _Error('UEx0003', this.getOrderStatus.name, JSON.stringify(orderData, null, 2))
			throw error
		}

		const actualOrder: OrderEntity = orderInfo[0]
		// this.logger.debug('\nACTUAL ORDER: ' + JSON.stringify(actualOrder, null, 2));
		try {
			actualOrder.Items =  await this.db.findItemsByOrderId(actualOrder.OrderId)
		} catch (e) {
			if (e.stack === this.db.findOrderByTaskNo.name) e.stack += `--> ${this.getOrderStatus.name}`
			throw e
		}

	

		// this.logger.debug('\nFETCH ITEMS:' + JSON.stringify(actualOrder.Items, null, 2));

		// Получение статуса
		if (actualOrder.Items.length > 0){
			// получение всех статусов и запись в соответствующий объект
			for (let item of actualOrder.Items){
				let scanData : ScanDataEntity[]
				try {
					scanData = await this.db.findScanDataByItemId(item.ItemId)
				} catch (e) {
					if (e.stack === this.db.findOrderByOrderNo.name) e.stack += `--> ${this.getOrderStatus.name}`
					throw e
				} 
				// Обработка: получение последнего статуса
				scanData.sort((a,b)=> b.ScanDate.getTime() - a.ScanDate.getTime())
				item.ScanData = scanData[0]
				// this.logger.debug('\n UPDATED ITEM: ' + JSON.stringify(item, null, 2))	
			}
		} else {
			// Возврат статуса заказа (РАБОТА В ЦЕХЕ ЕЩЕ НЕ НАЧАТА)
			this.resultTXT = `Нашел :grin:\n  *Заказ ${actualOrder.OrderNo} / ${actualOrder.TaskNo}*`
			this.resultTXT += `  Статус: ${actualOrder.Status}`
			return this.resultTXT
		}

		// this.logger.debug('\n ACTUAL UPDATED ORDER: ' + JSON.stringify(actualOrder, null, 2))

		// Генерация ответа на последней стадии
		this.resultTXT = this.generateFullAnsw(actualOrder)
		return this.resultTXT
	}

	
	private generateFullAnsw(order: OrderEntity): string {
		let resultTXT = `Нашел :grin:\n*Заказ ${order.OrderNo} / ${order.TaskNo}*`
			order.Items.forEach(item => {
				resultTXT += `\n  `
				if (item.Position) resultTXT += `${item.Position} `
				if (item.Name) resultTXT += `*${item.Name}* `
				if (item.Size) resultTXT += `\n    Размер: ${item.Size}`
				if (item.ScanData) resultTXT += `\n    Статус: ${this.orderValid.validItemScanData(item.ScanData)}`
			})
		return resultTXT
	}
}
