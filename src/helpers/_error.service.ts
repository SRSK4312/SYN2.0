export class _Error {
	private  errorsBase: _errorsInterface = {
		AEx0001: "Недействтельный ТОКЕН доступа",
		UEx0001: "Получены не валидные данные",
		UEx0002: "Получено более одного активных заказов :",
		UEx0003: "Активный заказ не был получен",	
		DEx0001: "Неудалось получить данные из базы данных",
		DEx0002: "Состояние заказа отсутствует в базе бота",
		DEx0003: "Статус ОТК объекта заказа отсутствует в базе бота",
	}

	code: string;
	sys: string;
	stack: string;
	message: string;
	constructor (codeError: string, stack : string, sysMessage?: string){
		this.code = codeError
		this.stack = stack
		this.sys = this.errorsBase[codeError] ? this.errorsBase[codeError] : 'Неизвестная ошибка'
		this.sys += sysMessage ? `( ${sysMessage} )` : ''
		this.message = `Что-то пошло не так, обратитесь к системному администратору.` + `(Код ошибки: ${codeError})`
	}
}

	

export interface _errorsInterface {
	[key : string] : string
}