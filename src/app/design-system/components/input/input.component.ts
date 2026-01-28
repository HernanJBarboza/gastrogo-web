/**
 * GASTROGO - Input Component
 * Componente atómico de input con validación
 * Contraste AA garantizado
 */

import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper" [class.has-error]="error" [class.disabled]="disabled">
      @if (label) {
        <label [for]="inputId" class="label">
          {{ label }}
          @if (required) {
            <span class="required">*</span>
          }
        </label>
      }
      
      <div class="input-container" [class]="'size-' + size">
        @if (prefixIcon) {
          <span class="prefix-icon">{{ prefixIcon }}</span>
        }
        
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [autocomplete]="autocomplete"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (blur)="onTouched()"
          (focus)="onFocus.emit($event)"
        />
        
        @if (suffixIcon) {
          <span class="suffix-icon" (click)="onSuffixClick.emit()">{{ suffixIcon }}</span>
        }
        
        @if (type === 'password') {
          <button 
            type="button" 
            class="toggle-password"
            (click)="togglePassword()"
            [attr.aria-label]="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        }
      </div>
      
      @if (error) {
        <span class="error-message">{{ error }}</span>
      } @else if (hint) {
        <span class="hint">{{ hint }}</span>
      }
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      width: 100%;
    }

    .label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .required {
      color: var(--color-error);
      margin-left: 0.125rem;
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--bg-surface);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .input-container:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.2);
    }

    .has-error .input-container {
      border-color: var(--color-error);
    }

    .has-error .input-container:focus-within {
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2);
    }

    .disabled .input-container {
      background: var(--text-disabled);
      cursor: not-allowed;
    }

    input {
      flex: 1;
      border: none;
      background: transparent;
      font-family: var(--font-family);
      font-size: 1rem;
      color: var(--text-primary);
      outline: none;
      width: 100%;
    }

    input::placeholder {
      color: var(--text-secondary);
    }

    input:disabled {
      cursor: not-allowed;
    }

    /* Tamaños */
    .size-sm {
      height: 2rem;
      padding: 0 0.75rem;
    }

    .size-sm input {
      font-size: 0.875rem;
    }

    .size-md {
      height: 2.5rem;
      padding: 0 1rem;
    }

    .size-lg {
      height: 3rem;
      padding: 0 1.25rem;
    }

    .size-lg input {
      font-size: 1.125rem;
    }

    /* Icons */
    .prefix-icon,
    .suffix-icon {
      color: var(--text-secondary);
      font-size: 1.125rem;
      flex-shrink: 0;
    }

    .prefix-icon {
      margin-right: 0.5rem;
    }

    .suffix-icon {
      margin-left: 0.5rem;
      cursor: pointer;
    }

    .toggle-password {
      background: none;
      border: none;
      padding: 0.25rem;
      cursor: pointer;
      font-size: 1rem;
      margin-left: 0.5rem;
    }

    /* Mensajes */
    .error-message {
      font-size: 0.75rem;
      color: var(--color-error);
    }

    .hint {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() hint?: string;
  @Input() error?: string;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() autocomplete = 'off';
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  
  @Output() onFocus = new EventEmitter<FocusEvent>();
  @Output() onSuffixClick = new EventEmitter<void>();

  value: any = '';
  showPassword = false;
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  
  private onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }
}
