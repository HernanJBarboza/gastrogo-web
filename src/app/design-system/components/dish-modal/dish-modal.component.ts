/**
 * GASTROGO - Dish Detail Modal Component
 * Modal de detalles del plato con foto alta resolución
 */

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import type { Dish, DishModifier } from '../dish-card/dish-card.component';

export interface CartItem {
  dish: Dish;
  quantity: number;
  selectedModifiers: { modifierId: string; option: string; priceAdjustment: number }[];
  notes: string;
  totalPrice: number;
}

@Component({
  selector: 'app-dish-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="close()">
        <div 
          class="modal-container" 
          (click)="$event.stopPropagation()"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="'modal-title-' + dish?.id"
        >
          <!-- Close button -->
          <button class="close-button" (click)="close()" aria-label="Cerrar modal">
            ✕
          </button>
          
          @if (dish) {
            <!-- Image -->
            <div class="image-section">
              @if (dish.image_url) {
                <img 
                  [src]="dish.image_url" 
                  [alt]="dish.name"
                  class="dish-image"
                />
              } @else {
                <div class="image-placeholder">
                  <span>🍽️</span>
                </div>
              }
              
              @if (!dish.available) {
                <div class="unavailable-badge">No disponible</div>
              }
            </div>
            
            <!-- Content -->
            <div class="content-section">
              <header>
                <h2 [id]="'modal-title-' + dish.id" class="dish-name">{{ dish.name }}</h2>
                <p class="dish-price">{{ formatPrice(basePrice) }}</p>
              </header>
              
              <p class="dish-description">{{ dish.description }}</p>
              
              <!-- Allergens -->
              @if (dish.allergens && dish.allergens.length > 0) {
                <div class="allergens-section">
                  <h3>Alérgenos</h3>
                  <div class="allergens-list">
                    @for (allergen of dish.allergens; track allergen) {
                      <span class="allergen-badge">
                        {{ getAllergenInfo(allergen).icon }} {{ getAllergenInfo(allergen).name }}
                      </span>
                    }
                  </div>
                </div>
              }
              
              <!-- Modifiers -->
              @if (dish.modifiers && dish.modifiers.length > 0) {
                <div class="modifiers-section">
                  @for (modifier of dish.modifiers; track modifier.id) {
                    <div class="modifier-group">
                      <h3>{{ modifier.name }}</h3>
                      <div class="modifier-options">
                        @for (option of modifier.options; track option.name) {
                          <label class="modifier-option">
                            <input 
                              type="radio" 
                              [name]="'modifier-' + modifier.id"
                              [value]="option.name"
                              [checked]="isOptionSelected(modifier.id, option.name)"
                              (change)="selectModifier(modifier.id, option.name, option.price_adjustment)"
                            />
                            <span class="option-content">
                              <span class="option-name">{{ option.name }}</span>
                              @if (option.price_adjustment !== 0) {
                                <span class="option-price" [class.positive]="option.price_adjustment > 0">
                                  {{ option.price_adjustment > 0 ? '+' : '' }}{{ formatPrice(option.price_adjustment) }}
                                </span>
                              }
                            </span>
                          </label>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
              
              <!-- Notes -->
              <div class="notes-section">
                <h3>Notas especiales</h3>
                <textarea
                  [(ngModel)]="notes"
                  placeholder="Ej: Sin cebolla, bien cocido..."
                  rows="2"
                  class="notes-input"
                ></textarea>
              </div>
              
              <!-- Quantity & Add -->
              <div class="actions-section">
                <div class="quantity-selector">
                  <button 
                    class="qty-btn"
                    (click)="decreaseQuantity()"
                    [disabled]="quantity <= 1"
                    aria-label="Reducir cantidad"
                  >−</button>
                  <span class="quantity">{{ quantity }}</span>
                  <button 
                    class="qty-btn"
                    (click)="increaseQuantity()"
                    [disabled]="quantity >= 10"
                    aria-label="Aumentar cantidad"
                  >+</button>
                </div>
                
                <app-button 
                  variant="primary"
                  size="lg"
                  [disabled]="!dish.available"
                  (buttonClick)="addToCart()"
                  class="add-btn"
                >
                  Agregar {{ formatPrice(totalPrice) }}
                </app-button>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--z-modal, 1040);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
      animation: fadeIn 0.2s ease;
    }

    @media (min-width: 768px) {
      .modal-overlay {
        align-items: center;
        padding: 2rem;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-container {
      position: relative;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      background: var(--bg-surface);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease;
    }

    @media (min-width: 768px) {
      .modal-container {
        border-radius: var(--radius-xl);
        max-height: 85vh;
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .close-button:hover {
      background: rgba(0, 0, 0, 0.7);
      transform: scale(1.1);
    }

    /* Image */
    .image-section {
      position: relative;
      aspect-ratio: 16/10;
      background: var(--bg-elevated);
      flex-shrink: 0;
    }

    .dish-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      opacity: 0.5;
    }

    .unavailable-badge {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      padding: 0.5rem 1rem;
      background: var(--color-error);
      color: white;
      font-weight: 600;
      border-radius: var(--radius-md);
    }

    /* Content */
    .content-section {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .dish-name {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .dish-price {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary);
      white-space: nowrap;
    }

    .dish-description {
      margin: 0;
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    h3 {
      margin: 0 0 0.75rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Allergens */
    .allergens-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .allergen-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      background: rgba(244, 67, 54, 0.1);
      color: var(--color-error);
      font-size: 0.8125rem;
      font-weight: 500;
      border-radius: var(--radius-full);
    }

    /* Modifiers */
    .modifier-group {
      padding: 1rem;
      background: var(--bg-elevated);
      border-radius: var(--radius-lg);
    }

    .modifier-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .modifier-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--bg-surface);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .modifier-option:hover {
      background: var(--border-color);
    }

    .modifier-option input[type="radio"] {
      accent-color: var(--color-primary);
      width: 18px;
      height: 18px;
    }

    .option-content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .option-name {
      font-weight: 500;
      color: var(--text-primary);
    }

    .option-price {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .option-price.positive {
      color: var(--color-primary);
    }

    /* Notes */
    .notes-input {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-elevated);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      font-family: var(--font-family);
      font-size: 1rem;
      color: var(--text-primary);
      resize: none;
      transition: all var(--transition-fast);
    }

    .notes-input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .notes-input::placeholder {
      color: var(--text-secondary);
    }

    /* Actions */
    .actions-section {
      display: flex;
      gap: 1rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-color);
      margin-top: auto;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      background: var(--bg-elevated);
      border-radius: var(--radius-md);
    }

    .qty-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: transparent;
      border: none;
      font-size: 1.5rem;
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .qty-btn:hover:not(:disabled) {
      background: var(--border-color);
    }

    .qty-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .quantity {
      min-width: 2rem;
      text-align: center;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .add-btn {
      flex: 1;
    }
  `]
})
export class DishModalComponent implements OnInit {
  @Input() dish?: Dish;
  @Input() isOpen = false;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<CartItem>();

  quantity = 1;
  notes = '';
  selectedModifiers: Map<string, { option: string; priceAdjustment: number }> = new Map();

  private allergenInfo: Record<string, { icon: string; name: string }> = {
    'gluten': { icon: '🌾', name: 'Gluten' },
    'lactosa': { icon: '🥛', name: 'Lactosa' },
    'huevo': { icon: '🥚', name: 'Huevo' },
    'frutos_secos': { icon: '🥜', name: 'Frutos secos' },
    'mariscos': { icon: '🦐', name: 'Mariscos' },
    'pescado': { icon: '🐟', name: 'Pescado' },
    'soja': { icon: '🫘', name: 'Soja' },
    'apio': { icon: '🥬', name: 'Apio' },
    'mostaza': { icon: '🟡', name: 'Mostaza' },
    'sesamo': { icon: '⚪', name: 'Sésamo' },
    'sulfitos': { icon: '🍷', name: 'Sulfitos' },
    'moluscos': { icon: '🦪', name: 'Moluscos' },
  };

  ngOnInit(): void {
    this.resetState();
  }

  get basePrice(): number {
    return this.dish?.price || 0;
  }

  get modifiersPrice(): number {
    let total = 0;
    this.selectedModifiers.forEach(mod => {
      total += mod.priceAdjustment;
    });
    return total;
  }

  get totalPrice(): number {
    return (this.basePrice + this.modifiersPrice) * this.quantity;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  }

  getAllergenInfo(allergen: string): { icon: string; name: string } {
    return this.allergenInfo[allergen.toLowerCase()] || { icon: '⚠️', name: allergen };
  }

  isOptionSelected(modifierId: string, optionName: string): boolean {
    return this.selectedModifiers.get(modifierId)?.option === optionName;
  }

  selectModifier(modifierId: string, optionName: string, priceAdjustment: number): void {
    this.selectedModifiers.set(modifierId, { option: optionName, priceAdjustment });
  }

  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  close(): void {
    this.resetState();
    this.closeModal.emit();
  }

  addToCart(): void {
    if (!this.dish || !this.dish.available) return;

    const cartItem: CartItem = {
      dish: this.dish,
      quantity: this.quantity,
      selectedModifiers: Array.from(this.selectedModifiers.entries()).map(([modifierId, mod]) => ({
        modifierId,
        option: mod.option,
        priceAdjustment: mod.priceAdjustment,
      })),
      notes: this.notes.trim(),
      totalPrice: this.totalPrice,
    };

    this.addItem.emit(cartItem);
    this.close();
  }

  private resetState(): void {
    this.quantity = 1;
    this.notes = '';
    this.selectedModifiers.clear();
  }
}
