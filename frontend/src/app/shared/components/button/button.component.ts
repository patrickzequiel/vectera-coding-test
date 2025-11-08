import { Component, Input } from '@angular/core';

type ButtonVariant = 'primary' | 'nav' | 'w';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() href?: string;
  @Input() target?: string;
  @Input() disabled = false;
  @Input() prime = false;

  get classes() {
    return {
      button: this.variant !== 'w',
      'nav-bar-button': this.variant === 'nav',
      'w-button': this.variant === 'w',
    } as const;
  }
}
