// Основной интерфейс товара
export interface IProduct {
	id: string; // Уникальный идентификатор товара
	title: string; // Название товара
	description: string; // Описание товара
	image: string; // URL изображения товара
	category: string; // Категория ("софт-скил", "хард-скил" и т.д.)
	price: number | null; // Цена товара
}

// Представление корзины
export interface IBasket {
	items: HTMLElement[]; // DOM-элементы товаров в корзине
	selected: string[]; // IDs выбранных товаров (для оформления)
	price: number | null; // Общая стоимость товаров
}

// Данные доставки
export interface IDelivery {
	address: string; // Адрес доставки
	paying: string; // Способ оплаты ("online" или "offline")
}

export interface IContact {
	phone: string; // Телефон покупателя
	email: string; // Email покупателя
}

// Полные данные заказа
export interface IOrder extends IDelivery, IContact {
	address: string;
	payment: string;
	total: number; // Итоговая сумма заказа
	items: string[]; // ID товаров в заказе
	phone: string; // Телефон покупателя
	email: string;
}

// Результат оформления заказа
export interface IOrderResult {
	id: string; // ID заказа
	total: number; // Сумма заказа
}

// Ошибки валидации формы
export type ErrorForm = Partial<Record<keyof IOrder, string>>;

// Данные для успешного заказа
export interface ISuccsess {
	total: number; // Сумма для отображения в сообщении
}

// Состояние приложения
export interface IApiStatus {
	products: IProduct[]; // Весь каталог товаров
	basket: IProduct[]; // Товары в корзине (объекты, а не только ID)
	order: IOrder; // Данные оформляемого заказа
	orderResponse: IOrderResult | null; // Результат заказа (null если не оформлен)
	preview: string | null; // ID товара для превью (опечатка: должно быть preview)
}

// Тип ответа API для списков
export type ApiListResponse<Type> = {
	total: number; // Общее количество элементов
	items: Type[]; // Массив элементов
};
