import './scss/styles.scss';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IOrder, IProduct, IDelivery, IContact } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/apiWebLarek';
import { CatalogChangeEvent } from './components/appData';
import { EventEmitter } from './components/base/events';
import { Card } from './components/cards';
import { Page } from './components/page';
import { AppState } from './components/appData';
import { Order, Contact } from './components/order';
import { Modal } from './components/common/modal';
import { Basket } from './components/basket';
import { Success } from './components/succes';

// Инициализация API и глобального менеджера событий
const api = new AppApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Получение шаблонов из DOM
const cardTemlate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// UI-контейнеры и компоненты
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new Contact(cloneTemplate(contactsTemplate), events);

// Обработка обновления каталога — рендер карточек
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardTemlate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Отображение карточки
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

// Открытие модального окна товара по клику
events.on('card:select', (item: IProduct) => {
	page.locked = true;
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toBasket', item);
			card.button =
				appData.basket.indexOf(item) !== -1
					? 'Удалить из корзины'
					: 'Добавить в корзину';
		},
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			buttonTitle: 'Добавить в корзину',
		}),
	});
});

// Добавление/удаление товара из корзины
events.on('card:toBasket', (item: IProduct) => {
	if (appData.basket.indexOf(item) === -1) {
		events.emit('basket:add', item);
	} else {
		events.emit('basket:remove', item);
	}
});

// Добавление в корзину
events.on('basket:add', (item: IProduct) => {
	appData.addBasket(item);
});

// Удаление из корзины
events.on('basket:remove', (item: IProduct) => {
	appData.removeBasket(item);
});

// Размер корзины
events.on('basket:change', () => {
	page.counter = appData.basket.length;
});

// Открытие корзины
events.on('basket:open', () => {
	// basket.selected = appData.basket.map((item) => item.id);
	modal.render({
		content: basket.render({
			price: appData.getTotal(),
		}),
	});
});

// Обновление карточек внутри корзины
events.on('basket:change', () => {
	basket.items = appData.basket.map((item, identifierCard) => {
		const card = new Card(cloneTemplate(cardBasket), {
			onClick: () => {
				events.emit('basket:remove', item);
			},
		});
		return card.render({
			identifierCard: (identifierCard + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});

	basket.priceTotal = appData.getTotal();
});

// Открытие формы доставки
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открытие формы контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Валидация формы доставки
events.on('orderformErrors:change', (errors: Partial<IOrder>) => {
	const { address, payment } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Валидация формы контактов
events.on('contactsformErrors:change', (errors: Partial<IContact>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Обработка изменения любого поля доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IDelivery; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Обработка изменения любого поля контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContact; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

// Изменение поля ввода оплаты
events.on(
	`order.payment:change`,
	(data: { field: keyof IDelivery; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Блокировка страницы при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокировка при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});

// Отправка заказа
events.on('contacts:submit', () => {
	api
		.order(
			{
				...appData.order,
				total: appData.getTotal(),
				items: appData.basket.map((item) => item.id),
			}
		)
		.then((res) => {
			appData.clearBasket();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick() {
					modal.close();
					appData.orderReset();
					appData.contactReset();
				},
			});
			modal.render({
				content: success.render({
					total: res.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Получение данных
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});