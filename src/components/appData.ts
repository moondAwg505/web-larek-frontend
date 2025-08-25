import { Model } from './base/BaseModel';
import {
	IApiStatus,
	IProduct,
	ErrorForm,
	IOrder,
	IContact,
	IDelivery,
} from '../types/index';

export interface CatalogChangeEvent {
	products: IProduct[];
}

export class AppState extends Model<IApiStatus> {
	catalog: IProduct[] = [];
	basket: IProduct[] = [];
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		items: [],
		total: 0,
		paying: '',
	};

	preview: string | null;
	formErrors: ErrorForm = {};

	addBasket(product: IProduct) {
		// Добавляем товар, если его ещё нет в корзине
		if (!this.basket.find((p) => p.id === product.id)) {
			this.basket.push(product);
			this.order.items.push(product.id); // ID добавляем синхронно
			this.updateBasket();
		}
	}

	removeBasket(product: IProduct) {
		this.basket = this.basket.filter((p) => p.id !== product.id);
		this.order.items = this.order.items.filter((id) => id !== product.id);
		this.updateBasket();
	}

	clearBasket() {
		this.basket = [];
		this.order.items = [];
		this.updateBasket();
	}

	updateBasket() {
		this.order.total = this.getTotal();
		this.emitChanges('basket:change', this.basket);
	}

	getTotal() {
		return this.basket.reduce((sum, item) => sum + item.price, 0);
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('catalog:change', { products: this.catalog });
	}

	setPreview(product: IProduct) {
		this.preview = product.id;
		this.emitChanges('preview:changed', product);
	}

	setPayment(value:string) {
		this.order.payment = value
		this.emitChanges("order:change", this.order)
	}

	setOrderField<Field extends keyof IOrder>(field: Field, value: IOrder[Field]) {
		this.order[field] = value;

		if (this.validOrder()) {
		}
	}

	setContactField<Field extends keyof IContact>(field: Field, value: IContact[Field]) {
		this.order[field] = value;

		if (this.validOrder()) {
		}
	}

	validContact() {
		const errors: typeof this.formErrors = {};

		if (
			!this.order.email ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email)
		) {
			errors.email = 'Введите корректный email';
		}

		if (!this.order.phone || !/^\+?\d{10,15}$/.test(this.order.phone)) {
			errors.phone = 'Введите корректный номер телефона';
		}

		this.formErrors = errors;
		this.emitChanges('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Введите адрес';
		}

		this.formErrors = errors;
		this.emitChanges('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	resetOrder() {
		this.order.address = '';
		this.order.payment = '';
	}
		// 	email: '',
		// 	phone: '',
		// 	address: '',
		// 	payment: '',
		// 	items: [],
		// 	total: 0,
		// 	paying: '',
		// ;

		resetContacnt() {
		this.order.email = '';
		this.order.phone = '';
	}
	}
