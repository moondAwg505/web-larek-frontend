import { IProduct } from '../types';
import { Component } from './base/components';
import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

interface ICard extends IProduct {
	identifierCard?: string;
	buttonTitle?: string;
}

export class Card extends Component<ICard> {
	protected _identifierCard?: HTMLElement;
	protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _buttonTitle: string;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		this._identifierCard = container.querySelector('.basket__item-index');
		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set identifierCard(value: string) {
		this._identifierCard.textContent = value;
	}

	get identifierCard(): string {
		return this._identifierCard.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(settings[value]);
	}

	get category(): string {
		return this._category?.textContent || '';
	}

	disableButton(value: number | null) {
		if (!value) {
			if (this._button) {
				this._button.disabled = true;
			}
		}
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		this.disableButton(value);
	}

	get price(): number {
		return +this._price.textContent || 0;
	}

	set button(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
}
