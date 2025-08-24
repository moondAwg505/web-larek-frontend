import './scss/styles.scss';

// ===== Импорты =====
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/BaseEvents';
import { AppState } from './components/AppData';
import { MarketApi } from './components/ApiWebLarek';
import { IOrder, IOrderResult, IProduct } from './types';
import { Contacts, Order } from './components/Order';
import { Basket } from './components/common/basket';
import { Success } from './components/common/succes';
import { Modal } from './components/common/modal';
import { Page } from './components/Page';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Cards } from './components/Cards';
import { CatalogChangeEvent } from './components/AppData';

// ===== Инициализация ядра =====
const api = new MarketApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);

// Отладка событий
events.onAll(({ eventName, data }) => console.log(eventName, data));

// ===== Получаем шаблоны =====
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// ===== View-компоненты =====
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLTemplateElement>('#modal-container'), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactsTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

// ===== Подписки View на Model =====

// Обновление каталога при изменении данных
events.on<CatalogChangeEvent>('catalog:change', () => {
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

// Обновление счётчика корзины
events.on('basket:update', () => {
	page.counter = appData.basket.length;

	const items = appData.basket.map((product) => {
		const card = new Cards(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove', product),
		});
		return card.render({
			title: product.title,
			price: product.price,
		});
	});

	basket.items = items;
	basket.priceTotal = appData.getTotal();
});

// ===== Presenter: связывание действий =====

// Открытие карточки товара
events.on('product:select', (item: IProduct) => {
  appData.setPreview(item);
  modal.render({
    content: new Cards(cloneTemplate(cardPreviewTemplate), {
      onClick: () => events.emit('basket:add', item),
    }).render(item),
  });
  modal.open();
});

// Добавление в корзину
events.on('basket:add', (product: IProduct) => {
	appData.addBasket(product);
	events.emit('basket:update');
});

// Удаление из корзины
events.on('basket:remove', (product: IProduct) => {
	appData.removeBasket(product);
	events.emit('basket:update');
});

// Открытие корзины
events.on('basket:open', () => {
	basket.selected = appData.basket.map((item) => item.id);
	modal.render({
		content: basket.render({
			price: appData.getTotal(),
		}),
	});
	modal.open();
});

// Открытие форм
events.on('order:open', () => {
	modal.render({ content: order.render({ address: '', errors: [], valid: false }) });
	modal.open();
});

events.on('contact:open', () => {
	modal.render({ content: contact.render({ phone: '', email: '', errors: [], valid: false }) });
	modal.open();
});

// Валидация форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { address} = errors;
	order.valid = !address
	order.errors = Object.values({ address}).filter(Boolean).join('; ');
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const {email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({email, phone }).filter(Boolean).join('; ');
});

// Обновление данных формы
events.on(/^order\..*:change/, (data: { field: keyof IOrder; value: string }) =>
	appData.setOrderField(data.field, data.value)
);
events.on(/^contacts\..*:change/, (data: { field: keyof IOrder; value: string }) =>
	appData.setOrderField(data.field, data.value)
);
events.on(/^payment\..*:change/, (data: { field: keyof IOrder; value: string }) =>
	appData.setOrderField(data.field, data.value)
);

// Блокировка/разблокировка страницы
events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));

// Отправка заказа
events.on('order:submit', (data: IOrder) => {
  console.log('order form submitted', data);
  events.emit('contact:open');
});


events.on('contacts:submit', () => {
	api
		.order(
			{
				...appData.order,
				// ...data,
				total: appData.getTotal(),
				items: appData.basket.map((item) => item.id),
			}
		)
		.then((res) => {
			appData.clearBasket();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick() {
					modal.close();
					appData.resetOrder();
					appData.resetContacnt();
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

// ===== Запуск: загрузка каталога =====
api.getProductList()
	.then((data) => appData.setCatalog(data))
	.catch(console.error);
