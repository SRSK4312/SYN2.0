import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'ScanData'})
export class ScanDataEntity {
	@PrimaryGeneratedColumn({name: "Id"})
	Id: string;

  @Column({name: "ItemId"})
  ItemId: string;

	@Column({name: "WhereId"})
	Status: string;
	
	@Column({name: "UserLogin"})
	User: string;

	@Column({name: "ScanDateTime"})
	ScanDate: Date;
}