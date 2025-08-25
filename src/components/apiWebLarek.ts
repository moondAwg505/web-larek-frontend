import { IOrder, IOrderResult, IProduct, ApiListResponse } from '../types';
import { Api } from './base/BaseApi';

export interface IAppAPI {
	getProductList: () => Promise<IProduct[]>;
	order: (order: IOrder) => Promise<IOrderResult>;
}

export class MarketApi extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Принимает изображения с сервера
	private normalizeProduct(item: IProduct): IProduct {
		return {
			...item,
			image: `${this.cdn}${item.image}`,
		};
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => this.normalizeProduct(item))
		);
	}

	order(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
