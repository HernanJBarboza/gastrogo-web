/**
 * GASTROGO - Dish Card Component
 * Tarjeta de plato para el menú interactivo
 * Optimizada para restaurantes con fotos de alta resolución
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_name?: string;
  available: boolean;
  preparation_time?: number;
  allergens?: string[];
  modifiers?: DishModifier[];
}

export interface DishModifier {
  id: string;
  name: string;
  options: {
    name: string;
    price_adjustment: number;
  }[];
}

@Component({
  selector: 'app-dish-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article 
      class="dish-card" 
      [class.unavailable]="!dish.available"
      [class.compact]="compact"
      (click)="onCardClick()"
      tabindex="0"
      role="button"
      [attr.aria-label]="dish.name + ' - ' + formatPrice(dish.price)"
    >
      <!-- Imagen -->
      <div class="image-container">
        @if (dish.image_url) {
          <img 
            [src]="dish.image_url" 
            [alt]="dish.name"
            loading="lazy"
            (error)="onImageError($event)"
          />
        } @else {
          <div class="image-placeholder">
            <span class="placeholder-icon">🍽️</span>
          </div>
        }
        
        @if (!dish.available) {
          <div class="unavailable-overlay">
            <span>Agotado</span>
          </div>
        }
        
        @if (dish.preparation_time) {
          <span class="prep-time">
            ⏱️ {{ dish.preparation_time }} min
          </span>
        }
      </div>
      
      <!-- Contenido -->
      <div class="content">
        <div class="header">
          <h3 class="name">{{ dish.name }}</h3>
          <span class="price">{{ formatPrice(dish.price) }}</span>
        </div>
        
        @if (!compact) {
          <p class="description">{{ dish.description }}</p>
        }
        
        <!-- Alérgenos -->
        @if (dish.allergens && dish.allergens.length > 0) {
          <div class="allergens">
            @for (allergen of dish.allergens; track allergen) {
              <span class="allergen-tag" [title]="allergen">
                {{ getAllergenIcon(allergen) }}
              </span>
            }
          </div>
        }
        
        <!-- Acciones -->
        <div class="actions">
          @if (dish.available) {
            <button 
              class="add-button"
              (click)="addToCart($event)"
              [attr.aria-label]="'Añadir ' + dish.name + ' al carrito'"
            >
              <span class="icon">+</span>
              @if (!compact) {
                <span>Añadir</span>
              }
            </button>
          }
          
          <button 
            class="details-button"
            (click)="viewDetails($event)"
            [attr.aria-label]="'Ver detalles de ' + dish.name"
          >
            @if (compact) {
              <span>ℹ️</span>
            } @else {
              <span>Ver más</span>
            }
          </button>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .dish-card {
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-normal);
      cursor: pointer;
    }

    .dish-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .dish-card:focus-visible {
      outline: 3px solid var(--color-primary);
      outline-offset: 2px;
    }

    .dish-card.unavailable {
      opacity: 0.7;
    }

    .dish-card.compact {
      flex-direction: row;
      max-height: 120px;
    }

    /* Imagen */
    .image-container {
      position: relative;
      aspect-ratio: 16/10;
      overflow: hidden;
      background: var(--bg-elevated);
    }

    .compact .image-container {
      width: 120px;
      min-width: 120px;
      aspect-ratio: 1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-normal);
    }

    .dish-card:hover img {
      transform: scale(1.05);
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-elevated), var(--border-color));
    }

    .placeholder-icon {
      font-size: 3rem;
      opacity: 0.5;
    }

    .compact .placeholder-icon {
      font-size: 2rem;
    }

    .unavailable-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.125rem;
    }

    .prep-time {
      position: absolute;
      bottom: 0.5rem;
      left: 0.5rem;
      background: rgba(0, 0, 0, 0.75);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
    }

    /* Contenido */
    .content {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .compact .content {
      padding: 0.75rem;
      gap: 0.375rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .name {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .compact .name {
      font-size: 1rem;
    }

    .price {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-primary);
      white-space: nowrap;
    }

    .compact .price {
      font-size: 1rem;
    }

    .description {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Alérgenos */
    .allergens {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
    }

    .allergen-tag {
      font-size: 1rem;
      cursor: help;
    }

    /* Acciones */
    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .add-button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      background: var(--color-primary);
      color: #000;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .add-button:hover {
      background: #E65100;
    }

    .add-button .icon {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .compact .add-button {
      padding: 0.375rem;
      flex: none;
      width: 36px;
      height: 36px;
    }

    .details-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 0.75rem;
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .details-button:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }

    .compact .details-button {
      padding: 0.375rem;
      width: 36px;
      height: 36px;
    }
  `]
})
export class DishCardComponent {
  @Input({ required: true }) dish!: Dish;
  @Input() compact = false;
  
  @Output() add = new EventEmitter<Dish>();
  @Output() details = new EventEmitter<Dish>();
  @Output() cardClick = new EventEmitter<Dish>();

  private allergenIcons: Record<string, string> = {
    'gluten': '🌾',
    'lactosa': '🥛',
    'huevo': '🥚',
    'frutos_secos': '🥜',
    'mariscos': '🦐',
    'pescado': '🐟',
    'soja': '🫘',
    'apio': '🥬',
    'mostaza': '🟡',
    'sesamo': '⚪',
    'sulfitos': '🍷',
    'moluscos': '🦪',
  };

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  }

  getAllergenIcon(allergen: string): string {
    return this.allergenIcons[allergen.toLowerCase()] || '⚠️';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  onCardClick(): void {
    this.cardClick.emit(this.dish);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    if (this.dish.available) {
      this.add.emit(this.dish);
    }
  }

  viewDetails(event: Event): void {
    event.stopPropagation();
    this.details.emit(this.dish);
  }
}
