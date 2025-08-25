import { Component } from './base/BaseComponents';
import { IEvents } from './base/BaseEvents';
import { ensureElement } from '../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	
	// Помогает безопасно получать DOM-елементы
	private getElement<T extends HTMLElement>(selector: string): T {
		return ensureElement<T>(selector, this.container);
	}

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = this.getElement('.header__basket-counter');
		this._catalog = this.getElement('.gallery');
		this._wrapper = this.getElement('.page__wrapper');
		this._basket = this.getElement('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
