# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

src/
├── base/ # Базовые классы
  ├── BaseApi.ts # Базовая клиентская логика (Api)
│ ├── BaseComponents.ts # Базовый компонент (Component)
│ ├── BasaeEvents.ts # Система событий (EventEmitter)
│ └── BaseModel.ts # Базовая модель (Model)
├── components/ # Бизнес-логика
│ ├── AppData.ts # Состояние приложения (AppStatus)
│ ├── ApiWebLarek.ts # API для работы с бэкендом (AppApi)
│ ├── Cards.ts # Карточки товаров (Card)
│ ├── Order.ts # Формы заказа (Order, Contact)
│ └── Page.ts # Главная страница (Page)
├── common/ # Общие компоненты
│ ├── basket.ts # Корзина (Basket)
│ ├── form.ts # Форма с валидацией (Form)
│ ├── modal.ts # Модальное окно (Modal)
│ └── succes.ts # Успешный заказ (Success)
├── scss/ # Стили
├── types/ # Типы данных
│ ├── index.ts # Интерфейсы приложения
├── utils/ # Вспомогательные функции
│ ├── constants.ts # Константы проекта
│ └── utils.ts # Утилиты
├── index.ts # Точка входа (Presenter)
└── index.html # HTML

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Архетиктура прокта Web-Larek

Проект сделан с использованием MVP (Model-View-Presenter) подхода.

* **View** - отвечает за отображение и пользовательский вывод.
* **Model** - Отвечает за данные, их изменение и их хранение.
* **Present** - Управлет потоком данных и логикой отображения.

## Базовый код
___________

**Класс API**

Реализует базовыую логик отправки запросов на сревер. Использует базовый URl и передаёт объект с заголовками и завааниями. Используемые методы:

* GET - Делает базовые запрос на сревер и возвращает промис с ответом
* POST - Возвращает объект JSON с заголовками и названиемями

**Класс EventEmitter**

Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.

Методы:
* on - Устанавливает обработчик на событие.
* off - Снимает обработчик с события.
* emit - Инициализирует событие с данными.
* onAll - Слушает все события.
* offAl - Сбрасывает все обработчики.
* trigger - Делает коллбек триггер, генерирующий событие при вызове.


**Класс Component<T>**

Асбтарктный класс, служит для создания интерфейса пользователя.

*Свойства класса*

```
readonly container: HTMLElement - Коренвого Dom-элемент
```

*Методы:*

```
* toggleClass(element: HTMLElement, className: string, force?: boolean) - Переключает класс
* protected setText(element: HTMLElement, value: unknown) - Устанавливает текстовое содержимое
* setDisabled(element: HTMLElement, state: boolean) - Меняет статус блокировки кнопок
* protected setHidden(element: HTMLElement) - Скрывет элемент
* protected setVisible(element: HTMLElement) - Показывает элемент
* protected setImage(element: HTMLImageElement, src: string, alt?: string) - Меняет изображение в DOM и обновлет его источник
* render(data?) - Возвращает корневой DOM-элемент
```


**Класс Model<T>**

Абстрактеый класс, принимает даные и события.

*Метод:* 

```
emitChanges(event: string, payload?: object) - Сообщает слушателям об изменении
```


**Класс Form<T>**

Класс управляет существуюущей HTML формой, добавляя валидацию, обработку событи и синхранизацию с данными

*Свойства класса*

```
protected _submit: HTMLButtonElement;
protected _errors: HTMLElement;
```

*Коснтруктор класса:*

```
constructor(protected container: HTMLFormElement, protected events: IEvents) - Принимает начальные данные и объект событий для уведомления об изменениях формы.
```

*Методы:*

```
* protected onInputChange(field: keyof T, value: string) - Обрабочик событий ввода, который обрабатывает изменения значений полей формы.
* set valid(value: boolean)  - Валидация формы.
* set errors(value: string) - Сообщения об ошибках.
* render(state: Partial<T> & IFormState) - Рендеринг данных переданых форме.
```


**Класс Modal**

Отвечает за попап, открытие и закртие, и его обновления

*Свойства класса*

```
protected _closeButton: HTMLButtonElement;
protected _content: HTMLElement;
```

*Коснтруктор класса:*

```
constructor(container: HTMLElement, protected events: IEvents)
```

*Методы:*

```
* set content(value: HTMLElement) - Динамическое обновление модержимого попапа
* open() - Открывет попап.
* close() - Закрывает попап.
* render(data: IModalData): HTMLElement - Рендеринг отображения попапа.
```


**Класс MarketApi**

Связь с бэкендом

*Конструктор:*

```
constructor(cdn: string, baseUrl: string, options?: RequestInit) - Установка данных с помощью API_URL, CDN_URL
```

*Методы:*

```
* getProductList(): Promise<IProduct[]> - Получение данных о товарах с сервера
* order(order: IOrder): Promise<IOrderResult> - Отправка данных на сервер из формы заказа и корзины
```


**Класс AppState**

Состояние приложения

*Свойства класса*

```
	catalog: IProduct[]; - Товары
	basket: IProduct[] = []; - Товары в корзине
	order: IOrder = {
		total: 0,
		items: [],
		phone: '',
		email: '',
		payment: '',
		address: '',
		paying: ''
	}; - Данные заказа
    orderError: ErrorForm = {}; - Ошибка заказа
	preview: string | null; - Отображение товара по ID
```

*Методы:*

```
* addBasket(product: IProduct) - Добавление товара в корзину
* removeBasket(product: IProduct) - Удаление товара из корзины
* clearBasket() - Отчистка корзины
* updateBasket() - Обновление корзины
* getTotal(): number - Высчитывание общей суммы заказа
* setCatalog(products: IProduct[]) - Установка каталога товаров
* setOrderField(field: keyof IDelivery, value: string) - Установка данных о способе оплаты и адрессе
* setContactField(field: keyof IContact, value: string) - Установка даннх контактов
* validateOrder() - Валидцаия формы заказа
* validateContact() - Валидация формы контактов
* setPreview(item: IProduct) - Показы товаров
* setPayment(value:string) - Установка способа оплаты
* resetOrder() - Отчистка полей формы
* resetContacnt() - Отчистка полей формы
```

*События в приложении*

```
* 'items:changed' - При обновлении каталога товаров.
* 'basket:change' - При любом изменении корзины.
* 'orderformErrors:change' - При ошибках валидации формы доставки/оплаты.
* 'contactsformErrors:change' - При ошибках валидации формы контактов.
* 'order:change' - Уведомление системы о изменении заказа.
```


**Класс Basket**

Отвечает за отображение состояния корзины

*Конструктор:*

```
constructor(container: HTMLElement, protected events: EventEmitter) 
```

*Свойства класса*

```
protected _list: HTMLElement;
protected _price: HTMLElement;
protected _button: HTMLButtonElement;
```

*Методы:*

```
* set items(items: HTMLElement[]) - Обновляет список товаров в корзине.
* set priceTotal(price: number) - Обновляет общую сумму товаров.
```


**Класс Cards**

Отвечает за отображение и поведение карточки товара.

*Конструктор:*

```
constructor(container: HTMLElement, actions: ICardActions)
```

*Свойства класса*

```
protected idIdeficationElement?: HTMLElement; - Id товара.
protected titleElement: HTMLElement; - Название товара.
protected descriptionElement?: HTMLElement; - Описание товара.
protected imageElement: HTMLImageElement; - Изображение товара.
protected category: HTMLElement; - Категория товара.
protected price: HTMLElement; - Цена товара.
protected button?: HTMLButtonElement; - Кнопка взаимодействия.
protected titleButton?: HTMLElement; - Текст внутри кнопки.
```

*Методы:*

```
* set id(value: string) - Утснавливает ID товара.
* get id() - Возвращает ID карточки.
* set identifierCard(value: string) - Уставнавливает ноимер позиции в корзине.
* get identifierCard(): string - Возвращает номер позиции.
* set title(value: string) - Устанавиливает название товара.
* get title() - Возвращает название товара.
* set image(value: string) - URl изображение товара.
* set description(value: string) - Описаныие товара.
* set category(value: string) - Категория товара.
* get category() - Возваращет категорию товара.
* disableButton(value: number | null) - Блокаирует кнопку по условию.
* set price(value: number) - Цена товара.
* get price() - Возвращает цену товара.
* setButtonText(text: string) - Увтснавливает текст кнопки.
* set buttonState(price: number) - Делает кнопку активной и на оборот в зависимости от цены продукта.
```


**Класс Order**

Работает с данными заказа, управляют формами покупки. Наследуется от Form<IOrder>.

*Конструктор:*

```
constructor(container: HTMLFormElement, events: IEvents)
```

*Свойства класса*

```
protected _payment: HTMLButtonElement[];
```

*Методы:*

```
* set address(value: string) - Устанавливает значение адреса в поле ввода.
* set payment(name: string) - Помечает выбранную кнопку оплаты.
* clearFieldPayment() - Сбрасывает выбор оплаты.
* set valid(value: boolean) - Блокирует/разблокирует кнопку отправки формы.
```


**Класс Contact**

Работает с данными заказа, управляют формами покупки. Наследуется от Form<IOrder>.

*Конструктор:*

```
constructor(container: HTMLFormElement, events: IEvents)
```

*Методы:*

```
* set phone(value: string) - Устанавливает значение телефона в поле ввода.
* set email(value: string) - Устанавливает значение email в поле ввода.
* set valid(value: boolean) - Блокирует/разблокирует кнопку отправки формы

```


*Класс Page*

Управляет основными элементами страницы.

*Конструктор:* 

```
constructor(container: HTMLElement, protected events: IEvents)
```

*Свойства класса*

```
protected _counter: HTMLElement;
protected _catalog: HTMLElement;
protected _wrapper: HTMLElement;
protected _basket: HTMLElement;
```

*Методы:*

```
* set counter(value: number) - Обновляет счётчик товаров в корзине.
* set catalog(items: HTMLElement[]) - Заменяет содержимое каталога.
* set locked(value: boolean) - Блокирует/разблокирует страницу.
```


**Класс Success**

*Конструктор:* 

```
constructor(container: HTMLElement, protected actions?: ISuccessActions)
```

*Свойства класса*

```
protected _total: HTMLElement;
protected _closeButton: HTMLButtonElement;
```

*Методы:*

```
* set total(value: string) - Устанавливает текст с суммой заказа.
```

### Типы данных

Основной интерфейс товара

```
export interface IProduct {
	id: string; // Уникальный идентификатор товара
	title: string; // Название товара
	description: string; // Описание товара
	image: string; // URL изображения товара
	category: string; // Категория ("софт-скил", "хард-скил" и т.д.)
	price: number | null; // Цена товара
	buttonText?: string; // Меняет текст кнопки
}
```

Представление корзины

```
export interface IBasket {
	items: HTMLElement[]; // DOM-элементы товаров в корзине
	selected: string[]; // IDs выбранных товаров (для оформления)
	price: number | null; // Общая стоимость товаров
}
```

Данные доставки

```
export interface IDelivery {
    address: string // Адрес доставки
    paying: string // Способ оплаты ("online" или "offline")
}

export interface IContact {
    phone: string // Телефон покупателя
    email: string // Email покупателя
}
```

Полные данные заказа

```
export interface IOrder extends IDelivery, IContact {
	address: string; // Адрес доставки
	payment: string; // Оплата
	total: number; // Итоговая сумма заказа
	items: string[]; // ID товаров в заказе
	phone: string; // Телефон покупателя
	email: string;
}
```

Результат оформления заказа

```
export interface IOrderResult {
    id: string // ID заказа
    total: number // Сумма заказа
}
```

Ошибки валидации формы

```
export type ErrorForm = Partial<Record<keyof IOrder, string>>;
```

Данные для успешного заказа

```
export interface ISuccsess {
    total: number // Сумма для отображения в сообщении
}
```

Состояние приложения

```
export interface IApiStatus  {
    products: IProduct[]; // Весь каталог товаров
    basket: IProduct[]; // Товары в корзине (объекты, а не только ID)
    order: IOrder; // Данные оформляемого заказа
    orderResponse: IOrderResult | null; // Результат заказа (null если не оформлен)
    preview: string | null; // ID товара для превью (опечатка: должно быть preview)
}
```

Тип ответа API для списков

```
export type ApiListResponse<Type> = {
    total: number; // Общее количество элементов
    items: Type[]; // Массив элементов
};
```
