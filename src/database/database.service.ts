import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { Repository } from "typeorm";
import { ItemEntity } from "./entity/item.entity";
import { ScanDataEntity } from "./entity/scanData.entity";
import { _Error } from "src/helpers/_error.service";


@Injectable()
export class DataBaseService {
	constructor (
		@InjectRepository(OrderEntity)
		private readonly OrderRepos: Repository<OrderEntity>,

		@InjectRepository(ItemEntity)
		private readonly itemRepos: Repository<ItemEntity>,

		@InjectRepository(ScanDataEntity)
		private readonly scanDataRepos: Repository<ScanDataEntity>,

		// private orderValid: OrderValid,
	){}

	private readonly logger = new Logger(DataBaseService.name)

	async findOrderByTaskNo(taskNo : string | number): Promise<OrderEntity[]>{
		try {
			return await this.OrderRepos.find({ where: { TaskNo: +taskNo } })
		} catch (e) {
			const error = new _Error(
				'DEx0001',
				e.stack ? e.stack : this.findOrderByTaskNo.name,
				e.message ? e.message + ` arg: ${taskNo}` :  ` arg: ${taskNo}`
			)
			throw error
		}
	}

	async findOrderByOrderNo (orderNo: string): Promise<OrderEntity[]>{
		try {
			return await this.OrderRepos.find({ where: { OrderNo: orderNo } });
		} catch (e) {
			const error = new _Error(
				'DEx0001',
				e.stack ? e.stack : this.findOrderByOrderNo.name,
				e.message ? e.message + ` arg: ${orderNo}` :  ` arg: ${orderNo}`
			)
			throw error
		}
	}

	async findItemsByOrderId(orderId: number): Promise<ItemEntity[]>{
		try {
			let findItemsData : ItemEntity[] =  await this.itemRepos.find({ where: { OrderID: orderId } });
			// Фльтр главенствующих позиций
			return findItemsData.filter(item => {
				return item.ItemId == item.FrameId
			})
		} catch (e) {
			const error = new _Error(
				'DEx0001',
				e.stack ? e.stack : this.findItemsByOrderId.name,
				e.message ? e.message + ` arg: ${orderId}` :  ` arg: ${orderId}`
			)
			throw error
		}
	}

	async findScanDataByItemId (itemId : string): Promise<ScanDataEntity[]>{
		try {
			return await this.scanDataRepos.find({ where: { ItemId: itemId }});
		} catch (e) {
			const error = new _Error(
				'DEx0001',
				e.stack ? e.stack : this.findScanDataByItemId.name,
				e.message ? e.message + ` arg: ${JSON.stringify(itemId, null, 2)}` :  ` arg: ${JSON.stringify(itemId, null, 2)}`
			)
		}
	}
}


