import { IProduct } from '../types';
import { Component } from './base/BaseComponents';
import { settings } from '../utils/constants';
import { ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICards extends IProduct {
	titleButton?: string;
	idIdefication?: string;
}

export class Cards extends Component<ICards> {
	protected idIdeficationElement?: HTMLElement;
	// protected idElement: HTMLElement;
	protected titleElement: HTMLElement;
	protected descriptionElement?: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected category: HTMLElement;
	protected price: HTMLElement;
	protected button?: HTMLButtonElement;
	protected titleButton?: HTMLElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		// this.idElement = container.querySelector('.basket__item-index');
		this.titleElement = ensureElement<HTMLElement>('.card__title', container);
		this.descriptionElement = container.querySelector('.card__text');
		this.imageElement = container.querySelector('.card__image');
		this.price = container.querySelector('.card__price') as HTMLElement;
		this.category = container.querySelector('.card__category') as HTMLElement;
		this.button = container.querySelector('.card__button') as HTMLButtonElement;

		if (actions?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', actions.onClick);
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
		this.idIdeficationElement.textContent = value;
	}

	get identifierCard(): string {
		return this.idIdeficationElement.textContent || '';
	}

	set title(value: string) {
		this.setText(this.titleElement, value);
	}

	get title(): string {
		return this.titleElement.textContent || '';
	}

	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}

	set image(value: string) {
		this.setImage(this.imageElement, value, this.title);
	}

	set priceElement(value: number) {
		this.setText(this.price, value ? `${value} синапcов` : 'бесценно');
	}

	get priceElement(): number {
		return +this.price.textContent;
	}

	set categoryElement(value: string) {
		this.setText(this.category, value);
		this.category.classList.add(settings[value]);
	}

	setButtonText(text: string) {
	if (this.button) {
		this.button.textContent = text;
	}
}

	set buttonState(price: number) {
		if (!this.button || !this.price) return;

		if (price > 0) {
			this.button.disabled = false;
			this.button.classList.add('card__button--active');
			this.setText(this.price, `${price} синапсов`);
			this.setText(this.button, 'Добваит в корзину');
		} else {
			this.button.disabled = true;
			this.button.classList.add('card__button--disabled');
			this.setText(this.price, 'Бесценно');
			this.setText(this.button, 'Недоступно');
		}
	}
}
