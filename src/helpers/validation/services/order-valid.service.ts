import { Logger } from "@nestjs/common"
import { ItemEntity } from "src/database/entity/item.entity"
import { OrderEntity } from "src/database/entity/order.entity"
import { ScanDataEntity } from "src/database/entity/scanData.entity"
import { _Error } from "src/helpers/_error.service"




export class OrderValidService {

	private readonly logger = new Logger(OrderValidService.name)
	public statuses = {
		STATES: {
			"0": "В работе: Салон",	// Расчет
			"3": "В работе: Салон",	// Расчет Д
			"9": "В работе: Заказ принят Салоном",	// Принят
			"13": "В работе: Заказ принят Салоном",	// Принят Д
			"12": "В работе: Заказ запущен в производство"	// В ПТО
		},
		OTK: {
		"9001101" : "БРАК: БОЙ СПУ",
		"9001102" : "БРАК: Бой при остеклении",
		"9001103" : "БРАК: Незначительный брак",
		"9001201" : "БРАК: Створка: фурнитура смещ/отсутс/недокр",
		"9001202" : "БРАК: Створка: мех. повреждения",
		"9001203" : "БРАК: Створка: сварной шов",
		"9001204" : "БРАК: Створка: незначительный брак",
		"9001205" : "БРАК: Створка: штапик",
		"9001206" : "БРАК: Створка: другое",
		"9001250" : "БРАК: Рама: фурнитура смещ/отсутс/недокр",
		"9001251" : "БРАК: Рама: мех повреждения",
		"9001252" : "БРАК: Рама: сварной шов",
		"9001253" : "БРАК: Рама: другое",
		"9001260" : "БРАК: Бой на складе",
		"9001265" : "БРАК: Бой при транспортировке",
		"9001300" : "БРАК: Стеклопакет: царапина",
		"9001301" : "БРАК: Грязь 1 линия (галочка)",
		"9001302" : "БРАК: Грязь 2 линия ",
		"9001303" : "БРАК: грязь 3 линия (точка)",
		"9001304" : "БРАК: Брак стекла",
		"9001305" : "БРАК: Дист рамка, смещ стекло",
		"9001306" : "БРАК: Стеклопакет: пленка ",
		"9001307" : "БРАК: Декор раскладка",
		"9001308" : "БРАК: Стеклопакет: другое",
		"9001999" : "ПРИНЯТО ОТК",
		"9002000" : "Ремонт"
		}
	}


		// Цеховой номер
	validTaskNo(taskNo : string) : boolean{ return (/^\d+$/.test(taskNo) )}
		
		// Офисный номер
	validOrderNo (orderNo: string ) : boolean { return ( orderNo.indexOf('-') >= 0 && orderNo.indexOf(' ') < 0) }

	validOrderEntity(order: OrderEntity): OrderEntity{
		const nowDate = new Date()

		// Архивные, отработанные заказы (отгруженные)
		if (order.ShipDate == null && order.State == 12 && nowDate.getTime() - order.OrderDate.getTime() >= 7884000000) {
			// this.logger.debug (`\n---- Filtered: ${order.OrderNo} OrderValidation: ARHFILTER1`)
			return
		} 
		
		if (order.State == 12 && order.ShipDate != null && nowDate.getTime() - order.ShipDate.getTime() >= 7884000000) {
			// this.logger.debug(`\n---- Filtered: ${order.OrderNo} OrderValidation: ARHFILTER2`)
			return
		}

		// Не запущенные заказы старше 3-х месяцев
		if ((order.State == 0 || order.State == 3) && nowDate.getTime() - order.OrderDate.getTime() >= 7884000000) {
			// this.logger.debug(`\n---- Filtered:  ${order.OrderNo} OrderValidation: TRASHFILTER1`)
			return
		}

		// Заказы на обработке ПТО (договоренность с ПТО до 11 часов дня запуск заказов)
		if ((order.State == 12 && order.WorkDate.getTime() + 39600000 >= nowDate.getTime())){
			console.log(order.OrderId, "OrderValidation: PTO FILTER _1")
			order.Status = "В работе: Технолог"
			return order
		}

		// Установка соответствующих статусов
		if(this.statuses.STATES[order.State])
			order.Status = this.statuses.STATES[order.State]
		else{
			const error = new _Error("DEx0002", this.validOrderEntity.name)
			this.logger.warn(`${error.stack}: ${error.sys}`)
			order.Status = 'Неизвестный статус, обратитесь к системному администратору (DEx0002)'
		}

		return order
	}

	validItemScanData (scanData : ScanDataEntity): string{
		let resultTXT = ''
		if (scanData.User.indexOf('otk') >= 0) {
			resultTXT += `${new Date(scanData.ScanDate).toLocaleString('ru', {day: 'numeric',month: 'numeric',year: 'numeric',	})} `
			resultTXT += this.statuses.OTK[scanData.Status] ? this.statuses.OTK[scanData.Status] : 'Неизвестный статус ОТК (Код ошибки: DEx0003), уточните данные у отдела ОТК'
		} else {
			resultTXT += 'На этапе производства'
		}
		return resultTXT
	}
}

