import { Model } from './base/model';
import {
	IProduct,
	IOrder,
	IApiStatus,
	ErrorForm,
	IDelivery,
	IContact,
} from '../types/index';

export interface CatalogChangeEvent {
	products: IProduct[];
}

export class AppState extends Model<AppState> {
	catalog: IProduct[];
	basket: IProduct[] = [];
	order: IOrder = {
		total: 0,
		items: [],
		phone: '',
		email: '',
		payment: '',
		address: '',
		paying: ''
	};
	
	orderError: ErrorForm = {};
	preview: string | null;

	addBasket(product: IProduct) {
		this.basket.push(product);
		this.updateBasket();
	}

	removeBasket(product: IProduct) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
		this.updateBasket();
	}

	clearBasket() {
		this.basket = [];
		this.updateBasket();
	}

	updateBasket() {
		this.events.emit('catalog:change', {
			products: this.basket,
		});
		this.events.emit('basket:change', {
			products: this.basket,
		});
	}

	getTotal(): number {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}

	setCatalog(products: IProduct[]) {
		this.catalog = products;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setOrderField(field: keyof IDelivery, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
		}
	}

	setContactField(field: keyof IContact, value: string) {
		this.order[field] = value;

		if (this.validateContact()) {
		}
	}

	validateOrder() {
		const errors: typeof this.orderError = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать cпособ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		this.orderError = errors;
		this.events.emit('orderformErrors:change', this.orderError);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.orderError = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.orderError = errors;
		this.events.emit('contactsformErrors:change', this.orderError);
		return Object.keys(errors).length === 0;
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	orderReset() {
		this.order.address = '';
		this.order.payment = '';
	}

	contactReset() {
		this.order.email = '';
		this.order.phone = '';
	}
}
