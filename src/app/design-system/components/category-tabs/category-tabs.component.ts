/**
 * GASTROGO - Category Tabs Component
 * Scroll horizontal de categorías para el menú
 */

import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  dish_count?: number;
}

@Component({
  selector: 'app-category-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabs-wrapper">
      @if (showArrows && canScrollLeft) {
        <button 
          class="scroll-arrow left"
          (click)="scrollLeft()"
          aria-label="Desplazar categorías a la izquierda"
        >
          ‹
        </button>
      }
      
      <div 
        #tabsContainer
        class="tabs-container"
        (scroll)="onScroll()"
      >
        <div class="tabs">
          @for (category of categories; track category.id) {
            <button
              class="tab"
              [class.active]="selectedId === category.id"
              (click)="selectCategory(category)"
              [attr.aria-selected]="selectedId === category.id"
              role="tab"
            >
              @if (category.icon) {
                <span class="tab-icon">{{ category.icon }}</span>
              }
              <span class="tab-label">{{ category.name }}</span>
              @if (showCounts && category.dish_count !== undefined) {
                <span class="tab-count">{{ category.dish_count }}</span>
              }
            </button>
          }
        </div>
      </div>
      
      @if (showArrows && canScrollRight) {
        <button 
          class="scroll-arrow right"
          (click)="scrollRight()"
          aria-label="Desplazar categorías a la derecha"
        >
          ›
        </button>
      }
    </div>
  `,
  styles: [`
    .tabs-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
    }

    .tabs-container {
      flex: 1;
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .tabs-container::-webkit-scrollbar {
      display: none;
    }

    .tabs {
      display: flex;
      gap: 0.25rem;
      padding: 0.75rem 1rem;
      min-width: max-content;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: transparent;
      border: none;
      border-radius: var(--radius-full);
      font-family: var(--font-family);
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);
    }

    .tab:hover {
      background: var(--bg-elevated);
      color: var(--text-primary);
    }

    .tab.active {
      background: var(--color-primary);
      color: #000;
    }

    .tab:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .tab-icon {
      font-size: 1.25rem;
    }

    .tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.25rem;
      height: 1.25rem;
      padding: 0 0.375rem;
      background: rgba(0, 0, 0, 0.1);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .tab.active .tab-count {
      background: rgba(0, 0, 0, 0.2);
    }

    /* Flechas de scroll */
    .scroll-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      box-shadow: var(--shadow-md);
      font-size: 1.5rem;
      font-weight: 300;
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .scroll-arrow:hover {
      background: var(--color-primary);
      color: #000;
      border-color: var(--color-primary);
    }

    .scroll-arrow.left {
      left: 0.5rem;
    }

    .scroll-arrow.right {
      right: 0.5rem;
    }
  `]
})
export class CategoryTabsComponent implements AfterViewInit {
  @ViewChild('tabsContainer') tabsContainer!: ElementRef<HTMLDivElement>;
  
  @Input({ required: true }) categories: Category[] = [];
  @Input() selectedId?: string;
  @Input() showCounts = true;
  @Input() showArrows = true;
  
  @Output() categorySelect = new EventEmitter<Category>();

  canScrollLeft = false;
  canScrollRight = false;

  ngAfterViewInit(): void {
    setTimeout(() => this.checkScrollButtons(), 0);
  }

  selectCategory(category: Category): void {
    this.selectedId = category.id;
    this.categorySelect.emit(category);
  }

  scrollLeft(): void {
    const container = this.tabsContainer.nativeElement;
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight(): void {
    const container = this.tabsContainer.nativeElement;
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }

  onScroll(): void {
    this.checkScrollButtons();
  }

  private checkScrollButtons(): void {
    const container = this.tabsContainer?.nativeElement;
    if (!container) return;
    
    this.canScrollLeft = container.scrollLeft > 0;
    this.canScrollRight = 
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
  }
}
