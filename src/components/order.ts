import { Form } from './common/form';
import { IOrder } from '../types';
import { IEvents } from './base/BaseEvents';

export class OrderForm extends Form<IOrder> {
	private _paymentButtons: HTMLButtonElement[] = [];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Ищем все кнопки оплаты внутри формы
		this._paymentButtons = Array.from(
			container.querySelectorAll<HTMLButtonElement>('.button_alt')
		);

		// Навешиваем обработчики
		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name; // меняем выбранный способ оплаты
				this.onInputChange('payment', button.name); // уведомляем базовый класс
			});

			this.container.querySelector('[name="payment-card"]')
  ?.addEventListener('click', () => {
    this.events.emit('payment.method:change', { method: 'card' });
  });

this.container.querySelector('[name="payment-cash"]')
  ?.addEventListener('click', () => {
    this.events.emit('payment.method:change', { method: 'card' });
  });
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(name: string) {
		// Визуально выделяем выбранную кнопку
		this._paymentButtons.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === name);
		});
	}

	clearPayment() {
		this._paymentButtons.forEach((button) => {
			button.classList.remove('button_alt-active');
		});
	}
}

export class ContactsForm extends Form<IOrder> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}
}
