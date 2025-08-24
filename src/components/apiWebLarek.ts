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

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
	});
	}

	order(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
