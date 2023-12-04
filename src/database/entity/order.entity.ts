import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ItemEntity } from './item.entity';

@Entity({name: 'Orders'})
export class OrderEntity {
	@Column({name: "OrderID"})
	OrderId: number;

	@PrimaryGeneratedColumn({name: "OrderNo"})
	OrderNo: string;

  @Column({name: "OrderTaskNo"})
  TaskNo: number;

	@Column ({name: "State"})
	State: number

	@Column({name: "Created"})
  CreatedDate: Date;

	@Column({name: "OrdDate"})
  OrderDate: Date | null;

	@Column ({name: "BeginWorkDate"})
	WorkDate: Date | null

	@Column ({name: "DueDate"})
	DueDate: Date | null

	@Column ({name: "ShipmentDate"})
	ShipDate : Date | null

	Items?: ItemEntity[]
	Status? : string
}