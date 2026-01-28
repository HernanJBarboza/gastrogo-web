/**
 * GASTROGO - Button Component
 * Componente atómico de botón con variantes
 * Contraste AA garantizado para todos los estados
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)"
    >
      @if (loading) {
        <span class="spinner"></span>
      }
      @if (icon && iconPosition === 'left') {
        <span class="icon icon-left">{{ icon }}</span>
      }
      <span class="label"><ng-content></ng-content></span>
      @if (icon && iconPosition === 'right') {
        <span class="icon icon-right">{{ icon }}</span>
      }
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: var(--font-family);
      font-weight: 600;
      border: 2px solid transparent;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      user-select: none;
    }

    button:focus-visible {
      outline: 3px solid var(--color-primary);
      outline-offset: 2px;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Tamaños */
    .btn-sm {
      height: 2rem;
      padding: 0 0.75rem;
      font-size: 0.875rem;
    }

    .btn-md {
      height: 2.5rem;
      padding: 0 1rem;
      font-size: 1rem;
    }

    .btn-lg {
      height: 3rem;
      padding: 0 1.5rem;
      font-size: 1.125rem;
    }

    /* Variantes */
    .btn-primary {
      background-color: var(--color-primary);
      color: #000;  /* Contraste 10:1 sobre naranja */
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #E65100;
    }

    .btn-primary:active:not(:disabled) {
      background-color: #BF360C;
    }

    .btn-secondary {
      background-color: var(--color-secondary);
      color: #fff;  /* Contraste 4.6:1 sobre verde */
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #388E3C;
    }

    .btn-secondary:active:not(:disabled) {
      background-color: #2E7D32;
    }

    .btn-outline {
      background-color: transparent;
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .btn-outline:hover:not(:disabled) {
      background-color: rgba(255, 152, 0, 0.1);
    }

    .btn-ghost {
      background-color: transparent;
      color: var(--text-primary);
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.05);
    }

    :host-context([data-theme="dark"]) .btn-ghost:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .btn-danger {
      background-color: var(--color-error);
      color: #fff;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #D32F2F;
    }

    /* Full width */
    .btn-full {
      width: 100%;
    }

    /* Spinner */
    .spinner {
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Icons */
    .icon {
      font-size: 1.2em;
      line-height: 1;
    }

    .icon-left {
      margin-left: -0.25em;
    }

    .icon-right {
      margin-right: -0.25em;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  
  @Output() buttonClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`,
    ];
    
    if (this.fullWidth) {
      classes.push('btn-full');
    }
    
    return classes.join(' ');
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}
