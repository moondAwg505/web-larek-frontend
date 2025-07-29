import { IBasket } from '../types';
import { EventEmitter } from './base/events';
import { Component } from './base/components';
import { ensureElement, createElement } from '../utils/utils';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
		this._button.disabled = items.length ? false : true;
	}

	// set selected(items: string[]) {
	// 	if (items.length) {
	// 		this.setDisabled(this._button, false);
	// 	} else {
	// 		this.setDisabled(this._button, true);
	// 	}
	// }

	set priceTotal(price: number) {
		this.setText(this._price, `${price.toString()} синапсов`);
	}
}
