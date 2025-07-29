import { ISuccsess } from '../types';
import { Component } from './base/components';
import { ensureElement } from '../utils/utils';

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccsess> {
	protected _total: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected actions?: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick)
			this._closeButton.addEventListener('click', actions.onClick);
	}
	set total(value: string) {
		this._total.textContent = `Списано ${value} синапсов`;
	}
}
