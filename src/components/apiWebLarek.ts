import { IProduct, IOrder, IOrderResult, ApiListResponse } from '../types';
import { Api } from './base/BaseApi';

export class AppApi extends Api {
	readonly cdn: string;

	constructor(cdnUrl: string, apiUrl: string, options?: RequestInit) {
		super(apiUrl, options);
		this.cdn = cdnUrl;
	}

	private getImageUrl(path: string) {
		return this.cdn + path;
	}


	// Получает весь список товара
	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	// Отправляет заказ на сервер
	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order)
			.then((result: IOrderResult) => result)
			.catch(err => {
				console.error('Ошибка при создании заказа:', err);
				throw err;
			});
	}
}
