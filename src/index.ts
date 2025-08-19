import './scss/styles.scss';

//Сделать импорты
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/BaseEvents';
import { AppState } from './components/AppData';
import { AppApi } from './components/ApiWebLarek';
import { IOrder, IOrderResult } from './types';
import { Contacts, Order } from './components/Order';
import { Basket } from './components/common/basket';
import { Success } from './components/common/succes';
import { Modal } from './components/common/modal';
import { Page } from './components/Page';
import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { Cards } from './components/Cards';
import { IProduct } from './types';

// Инициализация API и глобального менеджера событий
const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Получить шаблоны из DOM
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const gallery = document.querySelector<HTMLElement>('.gallery');

// Модель данных приложения
const appData = new AppState({}, events);

//Получить Ui-контейнеры и компоненты
const modal = new Modal(
	ensureElement<HTMLTemplateElement>('.modal__container'),
	events
);
const page = new Page(document.body, events);
const contact = new Contacts(cloneTemplate(contactsTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Сделать обнвление каталога ака рендер катрточек

events.on('catalog:change', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Cards(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('product:select', item),
		});

		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Сделать отображение карточек
events.on('product:select', (item: IProduct) => {
	appData.setPreview(item);
});

// Сделать открытие модельного окна товара по клику и изменение текста кнопки
events.on('product:select', (item: IProduct) => {
	modal.render({
		content: cloneTemplate(cardPreviewTemplate),
	});
	modal.open();
});

// Сделать добавление товара в корзину
events.on('basket:add', (product: IProduct) => {
	appData.addBasket(product);
	events.emit('basket:update');
});

// Сделать удаление товара из корзины
events.on('basket:remove', (product: IProduct) => {
	appData.removeBasket(product);
	events.emit('basket:update');
});

// Сделать увеличаение размеров корзины пропорционально количеству товара в ней
events.on('basket:update', () => {
	document.querySelector('.header__basket-counter').textContent =
		appData.card.size.toString();
});

// Сделать открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			price: appData.getTotal(),
		}),
	});
});

// Сделать обновленеи карточек внутри корзины
events.on('basket:update', () => {
	basket.render({
		price: appData.getTotal(),
	});
	document.querySelector('.header__basket-counter').textContent = String(
		appData.basket.length
	);
});

// Сделать открытие формы доставки
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			errors: [],
			valid: false,
		}),
	});
});

// Сделать открытие формы контактов
events.on('contant:open', () => {
	modal.render({
		content: contact.render({
			phone: '',
			email: '',
			errors: [],
			valid: false,
		}),
	});
});

// общая валидация
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { address, email, phone } = errors;
	order.valid = !address && !email && !phone;
	order.errors = Object.values({ address, email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Сделать обработку изменения любого поля доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Сделать обработку изменения любого поля контактов
events.on(
	/^contact\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Сделать изменения поля ввода оплаты
events.on(
	/^payment\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Сделать блокировку страницы при открытии модельного окна
events.on('modal:open', () => {
	page.locked = true;
});

// Сделать разблокировку страницы при закрытии модельного окна
events.on('modal:close', () => {
	page.locked = false;
});
// Сделать откправку заказа
// events.on('order:submit', (order: IOrder) => {
// 	api
// 		.createOrder(order)
// 		.then((result: IOrderResult) => {
// 			const success = new Success(cloneTemplate(successTemplate), {
// 				onClick: () => {
// 					modal.close();
// 					page.locked = false; // если у тебя есть блокировка
// 				},
// 			});

// 			modal.render({
// 				content: success.render({
// 					id: result.id, // тут пробрасываем номер заказа
// 				}),
// 			});

// 			appData.cart.clear();
// 			modal.open();
// 		})
// 		.catch(console.error);
// });

// Сделать получение данных
api
	.getProductList()
	.then((data) => {
		if (Array.isArray(data)) {
			appData.setCatalog(data);
		} else {
			console.error('Некорректный ответ API:', data);
		}
	})
	.catch((err) => console.error(err));
