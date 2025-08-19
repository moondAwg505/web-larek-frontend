// Базовые URL для API
export const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;
export const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;

export const settings: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-сктл': 'card__category_hard',
	кнопка: 'card__category-_button',
	дополнительно: 'card__category_additional',
	другое: 'card__category_other',
};

export const pay: { [key: string]: string } = {
	card: 'online',
	cash: 'cash',
};