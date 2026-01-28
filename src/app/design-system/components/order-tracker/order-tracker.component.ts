/**
 * GASTROGO - Order Tracker Component
 * Componente de tracking visual para clientes
 * Muestra el progreso: Recibido → Preparando → Listo → Entregado
 */

import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TrackingStatus = 'received' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface TrackingStep {
  id: TrackingStatus;
  label: string;
  icon: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  active: boolean;
}

export interface TrackedOrder {
  id: string;
  orderNumber: string;
  tableNumber: number;
  status: TrackingStatus;
  items: { name: string; quantity: number; }[];
  estimatedTime?: number; // minutes
  createdAt: string;
  updatedAt: string;
  statusHistory: { status: TrackingStatus; timestamp: string; }[];
}

@Component({
  selector: 'app-order-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracker-container" [class.compact]="compact">
      <!-- Header -->
      <div class="tracker-header" *ngIf="!compact">
        <div class="order-info">
          <span class="order-number">Pedido #{{ order?.orderNumber || '---' }}</span>
          <span class="table-badge">Mesa {{ order?.tableNumber }}</span>
        </div>
        <div class="status-badge" [class]="currentStatus">
          {{ getStatusLabel(currentStatus) }}
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-track">
        <div class="progress-line">
          <div class="progress-fill" [style.width.%]="progressPercentage"></div>
        </div>
        
        <div class="steps">
          <div 
            *ngFor="let step of steps; let i = index" 
            class="step"
            [class.completed]="step.completed"
            [class.active]="step.active"
            [class.cancelled]="currentStatus === 'cancelled'"
          >
            <div class="step-icon">
              <span class="icon" *ngIf="!step.completed">{{ step.icon }}</span>
              <span class="check" *ngIf="step.completed">✓</span>
              <div class="pulse-ring" *ngIf="step.active"></div>
            </div>
            <div class="step-info" *ngIf="!compact">
              <span class="step-label">{{ step.label }}</span>
              <span class="step-time" *ngIf="step.timestamp">
                {{ formatTime(step.timestamp) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estimated Time -->
      <div class="estimated-section" *ngIf="!compact && estimatedMinutes > 0 && currentStatus !== 'delivered' && currentStatus !== 'cancelled'">
        <div class="timer-icon">⏱️</div>
        <div class="timer-info">
          <span class="timer-label">Tiempo estimado</span>
          <span class="timer-value">{{ estimatedMinutes }} min</span>
        </div>
        <div class="timer-bar">
          <div class="timer-fill" [style.width.%]="timeProgress"></div>
        </div>
      </div>

      <!-- Order Items Preview -->
      <div class="items-preview" *ngIf="!compact && order?.items?.length">
        <div class="items-header">
          <span>Tu pedido</span>
          <span class="items-count">{{ order?.items?.length }} items</span>
        </div>
        <div class="items-list">
          <div class="item" *ngFor="let item of (order?.items || []).slice(0, 3)">
            <span class="item-qty">{{ item.quantity }}x</span>
            <span class="item-name">{{ item.name }}</span>
          </div>
          <div class="more-items" *ngIf="(order?.items?.length || 0) > 3">
            +{{ (order?.items?.length || 0) - 3 }} más
          </div>
        </div>
      </div>

      <!-- Status Message -->
      <div class="status-message" *ngIf="!compact" [class]="currentStatus">
        <span class="message-icon">{{ getStatusIcon(currentStatus) }}</span>
        <span class="message-text">{{ getStatusMessage(currentStatus) }}</span>
      </div>

      <!-- Actions -->
      <div class="tracker-actions" *ngIf="!compact && showActions">
        <button class="action-btn secondary" (click)="onCallWaiter()">
          🙋 Llamar Mozo
        </button>
        <button 
          class="action-btn danger" 
          *ngIf="canCancel"
          (click)="onCancelOrder()"
        >
          ✕ Cancelar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .tracker-container {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      max-width: 400px;
      margin: 0 auto;
    }

    .tracker-container.compact {
      padding: 16px;
      max-width: 100%;
      box-shadow: none;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .tracker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .order-number {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .table-badge {
      font-size: 13px;
      color: #666;
      background: #f0f0f0;
      padding: 2px 8px;
      border-radius: 4px;
      width: fit-content;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.received { background: #e3f2fd; color: #1976d2; }
    .status-badge.confirmed { background: #e8f5e9; color: #388e3c; }
    .status-badge.preparing { background: #fff3e0; color: #f57c00; }
    .status-badge.ready { background: #e8f5e9; color: #2e7d32; }
    .status-badge.delivered { background: #e0f2f1; color: #00796b; }
    .status-badge.cancelled { background: #ffebee; color: #c62828; }

    /* Progress Track */
    .progress-track {
      position: relative;
      padding: 0 10px;
    }

    .progress-line {
      position: absolute;
      top: 20px;
      left: 30px;
      right: 30px;
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      z-index: 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      border-radius: 2px;
      transition: width 0.5s ease;
    }

    .steps {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 1;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      position: relative;
      border: 3px solid #e0e0e0;
      transition: all 0.3s ease;
    }

    .step.completed .step-icon {
      background: #4CAF50;
      border-color: #4CAF50;
      color: white;
    }

    .step.active .step-icon {
      background: #FF9800;
      border-color: #FF9800;
      animation: pulse 2s infinite;
    }

    .step.cancelled .step-icon {
      background: #f44336;
      border-color: #f44336;
    }

    .check {
      color: white;
      font-weight: bold;
    }

    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #FF9800;
      animation: pulse-ring 1.5s ease-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes pulse-ring {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    .step-info {
      text-align: center;
    }

    .step-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }

    .step.completed .step-label { color: #4CAF50; }
    .step.active .step-label { color: #FF9800; }

    .step-time {
      display: block;
      font-size: 10px;
      color: #999;
      margin-top: 2px;
    }

    /* Estimated Time */
    .estimated-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 24px;
      padding: 16px;
      background: #fff8e1;
      border-radius: 12px;
    }

    .timer-icon {
      font-size: 24px;
    }

    .timer-info {
      flex: 1;
    }

    .timer-label {
      display: block;
      font-size: 12px;
      color: #666;
    }

    .timer-value {
      font-size: 18px;
      font-weight: 700;
      color: #f57c00;
    }

    .timer-bar {
      width: 60px;
      height: 6px;
      background: #ffe0b2;
      border-radius: 3px;
      overflow: hidden;
    }

    .timer-fill {
      height: 100%;
      background: #ff9800;
      transition: width 1s linear;
    }

    /* Items Preview */
    .items-preview {
      margin-top: 20px;
      padding: 16px;
      background: #fafafa;
      border-radius: 12px;
    }

    .items-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .items-count {
      color: #999;
      font-weight: 400;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item {
      display: flex;
      gap: 8px;
      font-size: 14px;
    }

    .item-qty {
      color: #FF9800;
      font-weight: 600;
      min-width: 24px;
    }

    .item-name {
      color: #333;
    }

    .more-items {
      font-size: 12px;
      color: #999;
      font-style: italic;
    }

    /* Status Message */
    .status-message {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 20px;
      padding: 16px;
      border-radius: 12px;
      font-size: 14px;
    }

    .status-message.received { background: #e3f2fd; color: #1565c0; }
    .status-message.confirmed { background: #e8f5e9; color: #2e7d32; }
    .status-message.preparing { background: #fff3e0; color: #ef6c00; }
    .status-message.ready { background: #c8e6c9; color: #1b5e20; }
    .status-message.delivered { background: #e0f2f1; color: #00695c; }
    .status-message.cancelled { background: #ffebee; color: #c62828; }

    .message-icon {
      font-size: 24px;
    }

    .message-text {
      font-weight: 500;
    }

    /* Actions */
    .tracker-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .action-btn {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn.secondary {
      background: #f5f5f5;
      color: #333;
    }

    .action-btn.secondary:hover {
      background: #e0e0e0;
    }

    .action-btn.danger {
      background: #ffebee;
      color: #c62828;
    }

    .action-btn.danger:hover {
      background: #ffcdd2;
    }

    /* Compact mode adjustments */
    .compact .progress-line {
      top: 12px;
      left: 20px;
      right: 20px;
    }

    .compact .step-icon {
      width: 24px;
      height: 24px;
      font-size: 12px;
      border-width: 2px;
    }
  `]
})
export class OrderTrackerComponent implements OnInit, OnDestroy {
  @Input() order?: TrackedOrder;
  @Input() compact = false;
  @Input() showActions = true;
  @Input() estimatedMinutes = 15;
  
  @Output() callWaiter = new EventEmitter<void>();
  @Output() cancelOrder = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<TrackingStatus>();

  steps: TrackingStep[] = [];
  currentStatus: TrackingStatus = 'received';
  progressPercentage = 0;
  timeProgress = 0;
  canCancel = true;

  private timeInterval?: ReturnType<typeof setInterval>;
  private startTime?: number;

  ngOnInit() {
    this.initializeSteps();
    if (this.order) {
      this.updateFromOrder(this.order);
    }
    this.startTimeTracking();
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private initializeSteps() {
    this.steps = [
      { id: 'received', label: 'Recibido', icon: '📝', description: 'Pedido recibido', completed: false, active: true },
      { id: 'confirmed', label: 'Confirmado', icon: '✓', description: 'Pedido confirmado', completed: false, active: false },
      { id: 'preparing', label: 'Preparando', icon: '👨‍🍳', description: 'En preparación', completed: false, active: false },
      { id: 'ready', label: 'Listo', icon: '🍽️', description: 'Listo para servir', completed: false, active: false },
    ];
  }

  updateFromOrder(order: TrackedOrder) {
    this.order = order;
    this.currentStatus = order.status;
    this.updateSteps(order.status);
    this.canCancel = order.status === 'received' || order.status === 'confirmed';
    
    // Update timestamps from history
    if (order.statusHistory) {
      order.statusHistory.forEach(h => {
        const step = this.steps.find(s => s.id === h.status);
        if (step) {
          step.timestamp = h.timestamp;
        }
      });
    }
  }

  updateStatus(status: TrackingStatus) {
    this.currentStatus = status;
    this.updateSteps(status);
    this.statusChange.emit(status);
  }

  private updateSteps(status: TrackingStatus) {
    const statusOrder: TrackingStatus[] = ['received', 'confirmed', 'preparing', 'ready', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    this.steps.forEach((step, index) => {
      step.completed = index < currentIndex;
      step.active = index === currentIndex;
    });

    // Calculate progress percentage
    this.progressPercentage = ((currentIndex) / (this.steps.length - 1)) * 100;
    
    // Update cancel ability
    this.canCancel = currentIndex <= 1;
  }

  private startTimeTracking() {
    this.startTime = Date.now();
    this.timeInterval = setInterval(() => {
      const elapsed = (Date.now() - this.startTime!) / 1000 / 60; // minutes
      this.timeProgress = Math.min((elapsed / this.estimatedMinutes) * 100, 100);
    }, 1000);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  getStatusLabel(status: TrackingStatus): string {
    const labels: Record<TrackingStatus, string> = {
      received: 'Recibido',
      confirmed: 'Confirmado',
      preparing: 'En Preparación',
      ready: '¡Listo!',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status];
  }

  getStatusIcon(status: TrackingStatus): string {
    const icons: Record<TrackingStatus, string> = {
      received: '📝',
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '🔔',
      delivered: '✨',
      cancelled: '❌',
    };
    return icons[status];
  }

  getStatusMessage(status: TrackingStatus): string {
    const messages: Record<TrackingStatus, string> = {
      received: 'Tu pedido fue recibido y está en cola',
      confirmed: 'El restaurante confirmó tu pedido',
      preparing: '¡El chef está preparando tu pedido!',
      ready: '¡Tu pedido está listo! Ya viene en camino',
      delivered: '¡Buen provecho! Esperamos que lo disfrutes',
      cancelled: 'Este pedido fue cancelado',
    };
    return messages[status];
  }

  onCallWaiter() {
    this.callWaiter.emit();
  }

  onCancelOrder() {
    this.cancelOrder.emit();
  }
}
