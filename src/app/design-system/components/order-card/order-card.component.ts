/**
 * GASTROGO - Order Card Component (KDS)
 * Tarjeta de pedido para Kitchen Display System
 * Dark Mode con colores según tiempo de espera
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OrderStatus = 'created' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'paid' | 'cancelled';

export interface OrderItem {
  id: string;
  dish_name: string;
  quantity: number;
  notes?: string;
  modifiers?: string[];
}

export interface Order {
  id: string;
  table_number: number;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
  total: number;
  notes?: string;
}

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article 
      class="order-card"
      [class]="'status-' + order.status"
      [class.urgent]="isUrgent"
      [class.critical]="isCritical"
    >
      <!-- Header -->
      <header class="header">
        <div class="table-info">
          <span class="table-number">Mesa {{ order.table_number }}</span>
          <span class="order-id">#{{ order.id.slice(-6).toUpperCase() }}</span>
        </div>
        
        <div class="time-info">
          <span class="timer" [class.pulse]="isUrgent || isCritical">
            {{ elapsedTime }}
          </span>
          <span class="status-badge">{{ getStatusLabel(order.status) }}</span>
        </div>
      </header>
      
      <!-- Items -->
      <div class="items-container">
        @for (item of order.items; track item.id) {
          <div class="item" [class.completed]="isItemCompleted(item.id)">
            <div class="item-main">
              <span class="quantity">{{ item.quantity }}x</span>
              <span class="dish-name">{{ item.dish_name }}</span>
              @if (showCheckmarks) {
                <button 
                  class="check-button"
                  [class.checked]="isItemCompleted(item.id)"
                  (click)="toggleItem(item.id)"
                  [attr.aria-label]="'Marcar ' + item.dish_name + ' como completado'"
                >
                  {{ isItemCompleted(item.id) ? '✓' : '○' }}
                </button>
              }
            </div>
            
            @if (item.modifiers && item.modifiers.length > 0) {
              <div class="modifiers">
                @for (mod of item.modifiers; track mod) {
                  <span class="modifier">+ {{ mod }}</span>
                }
              </div>
            }
            
            @if (item.notes) {
              <div class="item-notes">
                <span class="notes-icon">📝</span>
                {{ item.notes }}
              </div>
            }
          </div>
        }
      </div>
      
      <!-- Notes -->
      @if (order.notes) {
        <div class="order-notes">
          <span class="notes-icon">⚠️</span>
          {{ order.notes }}
        </div>
      }
      
      <!-- Actions -->
      <footer class="actions">
        @switch (order.status) {
          @case ('created') {
            <button class="action-btn confirm" (click)="updateStatus('confirmed')">
              ✓ Confirmar
            </button>
          }
          @case ('confirmed') {
            <button class="action-btn prepare" (click)="updateStatus('preparing')">
              🍳 Preparar
            </button>
          }
          @case ('preparing') {
            <button class="action-btn ready" (click)="updateStatus('ready')">
              🔔 Listo
            </button>
          }
          @case ('ready') {
            <button class="action-btn deliver" (click)="updateStatus('delivered')">
              📦 Entregar
            </button>
          }
        }
        
        @if (order.status !== 'cancelled' && order.status !== 'paid') {
          <button class="action-btn secondary" (click)="onPrint()">
            🖨️
          </button>
        }
      </footer>
    </article>
  `,
  styles: [`
    .order-card {
      --card-accent: var(--color-status-created);
      
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      border-left: 4px solid var(--card-accent);
      overflow: hidden;
      transition: all var(--transition-status);
      min-width: 280px;
      max-width: 320px;
    }

    /* Estados con colores */
    .status-created { --card-accent: #2196F3; }
    .status-confirmed { --card-accent: #9C27B0; }
    .status-preparing { --card-accent: #FF9800; }
    .status-ready { --card-accent: #4CAF50; }
    .status-delivered { --card-accent: #00BCD4; }
    .status-paid { --card-accent: #607D8B; opacity: 0.6; }
    .status-cancelled { --card-accent: #F44336; opacity: 0.5; }

    /* Urgencia por tiempo */
    .urgent {
      background: linear-gradient(
        135deg, 
        var(--bg-surface), 
        rgba(255, 152, 0, 0.1)
      );
      border-left-width: 6px;
    }

    .critical {
      background: linear-gradient(
        135deg, 
        var(--bg-surface), 
        rgba(244, 67, 54, 0.15)
      );
      border-left-width: 8px;
      animation: pulse-border 1s infinite;
    }

    @keyframes pulse-border {
      0%, 100% { border-left-color: #F44336; }
      50% { border-left-color: #FF5252; }
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem;
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border-color);
    }

    .table-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .table-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .order-id {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      color: var(--text-secondary);
    }

    .time-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.375rem;
    }

    .timer {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--text-primary);
    }

    .timer.pulse {
      animation: pulse-text 1s ease-in-out infinite;
    }

    @keyframes pulse-text {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      background: var(--card-accent);
      color: white;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: var(--radius-sm);
    }

    /* Items */
    .items-container {
      flex: 1;
      padding: 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px dashed var(--border-color);
    }

    .item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .item.completed {
      opacity: 0.5;
      text-decoration: line-through;
    }

    .item-main {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quantity {
      font-weight: 700;
      color: var(--color-primary);
      min-width: 2rem;
    }

    .dish-name {
      flex: 1;
      font-weight: 500;
      color: var(--text-primary);
    }

    .check-button {
      background: none;
      border: 2px solid var(--border-color);
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .check-button:hover {
      border-color: var(--color-secondary);
      color: var(--color-secondary);
    }

    .check-button.checked {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
      color: white;
    }

    .modifiers {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-left: 2.5rem;
    }

    .modifier {
      font-size: 0.75rem;
      color: var(--text-secondary);
      background: var(--bg-elevated);
      padding: 0.125rem 0.375rem;
      border-radius: var(--radius-sm);
    }

    .item-notes {
      font-size: 0.8125rem;
      color: var(--color-warning);
      margin-left: 2.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    /* Order notes */
    .order-notes {
      margin: 0 1rem 0.75rem;
      padding: 0.75rem;
      background: rgba(244, 67, 54, 0.1);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      color: var(--color-error);
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .notes-icon {
      flex-shrink: 0;
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--bg-elevated);
      border-top: 1px solid var(--border-color);
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .action-btn.confirm {
      background: #9C27B0;
      color: white;
    }

    .action-btn.prepare {
      background: #FF9800;
      color: #000;
    }

    .action-btn.ready {
      background: #4CAF50;
      color: white;
    }

    .action-btn.deliver {
      background: #00BCD4;
      color: white;
    }

    .action-btn.secondary {
      flex: none;
      width: 44px;
      background: var(--border-color);
      color: var(--text-primary);
    }

    .action-btn:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .action-btn:active {
      transform: translateY(0);
    }
  `]
})
export class OrderCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) order!: Order;
  @Input() showCheckmarks = true;
  
  @Output() statusChange = new EventEmitter<{ orderId: string; status: OrderStatus }>();
  @Output() print = new EventEmitter<Order>();
  @Output() itemToggle = new EventEmitter<{ orderId: string; itemId: string }>();

  elapsedTime = '00:00';
  isUrgent = false;   // > 10 min
  isCritical = false; // > 15 min
  
  private completedItems = new Set<string>();
  private timerInterval?: ReturnType<typeof setInterval>;

  private statusLabels: Record<OrderStatus, string> = {
    created: 'Nuevo',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Listo',
    delivered: 'Entregado',
    paid: 'Pagado',
    cancelled: 'Cancelado',
  };

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer(): void {
    this.updateElapsedTime();
    this.timerInterval = setInterval(() => this.updateElapsedTime(), 1000);
  }

  private updateElapsedTime(): void {
    const created = new Date(this.order.created_at);
    const now = new Date();
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000);
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    
    this.elapsedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Solo urgente si está en preparación
    if (this.order.status === 'preparing') {
      this.isUrgent = minutes >= 10 && minutes < 15;
      this.isCritical = minutes >= 15;
    } else {
      this.isUrgent = false;
      this.isCritical = false;
    }
  }

  getStatusLabel(status: OrderStatus): string {
    return this.statusLabels[status] || status;
  }

  isItemCompleted(itemId: string): boolean {
    return this.completedItems.has(itemId);
  }

  toggleItem(itemId: string): void {
    if (this.completedItems.has(itemId)) {
      this.completedItems.delete(itemId);
    } else {
      this.completedItems.add(itemId);
    }
    this.itemToggle.emit({ orderId: this.order.id, itemId });
  }

  updateStatus(newStatus: OrderStatus): void {
    this.statusChange.emit({ orderId: this.order.id, status: newStatus });
  }

  onPrint(): void {
    this.print.emit(this.order);
  }
}
