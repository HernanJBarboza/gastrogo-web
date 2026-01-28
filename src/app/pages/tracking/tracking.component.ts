/**
 * GASTROGO - Order Tracking Page
 * Página completa de seguimiento de pedido para clientes
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  OrderTrackerComponent, 
  TrackedOrder, 
  TrackingStatus,
  ButtonComponent 
} from '../../design-system';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, OrderTrackerComponent, ButtonComponent],
  template: `
    <div class="tracking-page">
      <!-- Header -->
      <header class="tracking-header">
        <button class="back-btn" (click)="goBack()">
          ← Volver al Menú
        </button>
        <div class="header-logo">🍴 GastroGo</div>
      </header>

      <!-- Main Content -->
      <main class="tracking-content">
        <!-- Loading State -->
        <div class="loading-state" *ngIf="loading">
          <div class="spinner"></div>
          <p>Cargando tu pedido...</p>
        </div>

        <!-- Error State -->
        <div class="error-state" *ngIf="error && !loading">
          <span class="error-icon">😕</span>
          <h2>Pedido no encontrado</h2>
          <p>{{ error }}</p>
          <button class="btn-primary" (click)="goBack()">Volver al Menú</button>
        </div>

        <!-- Order Tracker -->
        <div class="tracker-wrapper" *ngIf="order && !loading && !error">
          <div class="tracker-title">
            <h1>Seguimiento de Pedido</h1>
            <p class="subtitle">Actualizado en tiempo real</p>
          </div>

          <app-order-tracker
            [order]="order"
            [estimatedMinutes]="estimatedTime"
            [showActions]="true"
            (callWaiter)="handleCallWaiter()"
            (cancelOrder)="handleCancelOrder()"
            (statusChange)="handleStatusChange($event)"
          ></app-order-tracker>

          <!-- Live Updates Indicator -->
          <div class="live-indicator" *ngIf="isConnected">
            <span class="live-dot"></span>
            <span>Actualizaciones en vivo</span>
          </div>
          <div class="offline-indicator" *ngIf="!isConnected">
            <span class="offline-dot"></span>
            <span>Reconectando...</span>
          </div>

          <!-- Additional Info Cards -->
          <div class="info-cards">
            <div class="info-card">
              <span class="card-icon">🪑</span>
              <div class="card-content">
                <span class="card-label">Tu Mesa</span>
                <span class="card-value">{{ order.tableNumber }}</span>
              </div>
            </div>
            <div class="info-card">
              <span class="card-icon">🧾</span>
              <div class="card-content">
                <span class="card-label">Pedido</span>
                <span class="card-value">#{{ order.orderNumber }}</span>
              </div>
            </div>
            <div class="info-card">
              <span class="card-icon">🕐</span>
              <div class="card-content">
                <span class="card-label">Hora</span>
                <span class="card-value">{{ formatTime(order.createdAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Full Order Details -->
          <div class="order-details">
            <h3>Detalle del Pedido</h3>
            <div class="order-items">
              <div class="order-item" *ngFor="let item of order.items">
                <div class="item-info">
                  <span class="item-qty">{{ item.quantity }}x</span>
                  <span class="item-name">{{ item.name }}</span>
                </div>
                <span class="item-status" [class]="getItemStatus(item)">
                  {{ getItemStatusLabel(item) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Help Section -->
          <div class="help-section">
            <h4>¿Necesitas ayuda?</h4>
            <div class="help-actions">
              <button class="help-btn" (click)="handleCallWaiter()">
                🙋 Llamar Mozo
              </button>
              <button class="help-btn" (click)="handleRequestBill()">
                🧾 Pedir Cuenta
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- Notification Toast -->
      <div class="toast" *ngIf="toast.show" [class]="toast.type">
        <span class="toast-icon">{{ toast.icon }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .tracking-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding-bottom: 40px;
    }

    .tracking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .header-logo {
      font-size: 18px;
      font-weight: 700;
      color: white;
    }

    .tracking-content {
      padding: 20px;
      max-width: 480px;
      margin: 0 auto;
    }

    /* Loading & Error States */
    .loading-state, .error-state {
      text-align: center;
      padding: 60px 20px;
      color: white;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      margin: 0 auto 20px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-icon {
      font-size: 64px;
      display: block;
      margin-bottom: 16px;
    }

    .error-state h2 {
      margin-bottom: 8px;
    }

    .error-state p {
      opacity: 0.8;
      margin-bottom: 24px;
    }

    .btn-primary {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Tracker Wrapper */
    .tracker-wrapper {
      animation: slideUp 0.5s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .tracker-title {
      text-align: center;
      color: white;
      margin-bottom: 24px;
    }

    .tracker-title h1 {
      font-size: 24px;
      margin: 0 0 4px 0;
    }

    .subtitle {
      opacity: 0.8;
      font-size: 14px;
      margin: 0;
    }

    /* Live Indicator */
    .live-indicator, .offline-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
      font-size: 13px;
      color: white;
      opacity: 0.9;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      background: #4CAF50;
      border-radius: 50%;
      animation: blink 1s infinite;
    }

    .offline-dot {
      width: 8px;
      height: 8px;
      background: #ff9800;
      border-radius: 50%;
      animation: blink 0.5s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* Info Cards */
    .info-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 20px;
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      font-size: 24px;
    }

    .card-content {
      text-align: center;
    }

    .card-label {
      display: block;
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
    }

    .card-value {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #333;
    }

    /* Order Details */
    .order-details {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-top: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .order-details h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #333;
    }

    .order-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .item-info {
      display: flex;
      gap: 8px;
    }

    .item-qty {
      color: #FF9800;
      font-weight: 600;
    }

    .item-name {
      color: #333;
    }

    .item-status {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 500;
    }

    .item-status.pending {
      background: #e3f2fd;
      color: #1976d2;
    }

    .item-status.preparing {
      background: #fff3e0;
      color: #f57c00;
    }

    .item-status.ready {
      background: #e8f5e9;
      color: #388e3c;
    }

    /* Help Section */
    .help-section {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-top: 20px;
      text-align: center;
    }

    .help-section h4 {
      margin: 0 0 16px 0;
      font-size: 15px;
      color: #333;
    }

    .help-actions {
      display: flex;
      gap: 12px;
    }

    .help-btn {
      flex: 1;
      padding: 14px 16px;
      border: 2px solid #eee;
      background: white;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .help-btn:hover {
      border-color: #667eea;
      background: #f5f7ff;
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: #333;
      color: white;
      padding: 14px 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      animation: toastIn 0.3s ease;
      z-index: 1000;
    }

    .toast.success { background: #4CAF50; }
    .toast.warning { background: #ff9800; }
    .toast.error { background: #f44336; }

    @keyframes toastIn {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    .toast-icon {
      font-size: 18px;
    }

    .toast-message {
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  order?: TrackedOrder;
  loading = true;
  error = '';
  isConnected = true;
  estimatedTime = 15;

  toast = {
    show: false,
    type: 'success',
    icon: '✓',
    message: ''
  };

  private ws?: WebSocket;
  private reconnectInterval?: ReturnType<typeof setInterval>;

  // Mock order for demo
  private mockOrder: TrackedOrder = {
    id: 'ord-12345',
    orderNumber: 'A-127',
    tableNumber: 5,
    status: 'preparing',
    items: [
      { name: 'Provoleta', quantity: 1 },
      { name: 'Bife de Chorizo', quantity: 2 },
      { name: 'Ensalada Mixta', quantity: 1 },
      { name: 'Vino Malbec', quantity: 1 },
    ],
    estimatedTime: 20,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [
      { status: 'received', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
      { status: 'confirmed', timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString() },
      { status: 'preparing', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
    ]
  };

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    this.loadOrder(orderId);
    this.connectWebSocket();
  }

  ngOnDestroy() {
    this.ws?.close();
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
  }

  private loadOrder(orderId: string | null) {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      if (!orderId || orderId === 'demo') {
        this.order = this.mockOrder;
        this.estimatedTime = this.mockOrder.estimatedTime || 15;
      } else {
        // In production, fetch from API
        this.order = { ...this.mockOrder, id: orderId };
      }
      this.loading = false;
    }, 800);
  }

  private connectWebSocket() {
    // In production, connect to real WebSocket
    // For demo, simulate connection
    this.isConnected = true;

    // Simulate status updates for demo
    setTimeout(() => {
      if (this.order && this.order.status === 'preparing') {
        this.updateOrderStatus('ready');
        this.showToast('success', '🔔', '¡Tu pedido está listo!');
      }
    }, 10000);
  }

  private updateOrderStatus(status: TrackingStatus) {
    if (this.order) {
      this.order.status = status;
      this.order.statusHistory.push({
        status,
        timestamp: new Date().toISOString()
      });
      this.order.updatedAt = new Date().toISOString();
    }
  }

  handleStatusChange(status: TrackingStatus) {
    console.log('Status changed:', status);
  }

  handleCallWaiter() {
    this.showToast('success', '🙋', 'Mozo notificado, viene en camino');
    // In production, emit WebSocket event
  }

  handleCancelOrder() {
    if (confirm('¿Estás seguro de cancelar el pedido?')) {
      this.updateOrderStatus('cancelled');
      this.showToast('warning', '❌', 'Pedido cancelado');
    }
  }

  handleRequestBill() {
    this.showToast('success', '🧾', 'Cuenta solicitada');
  }

  goBack() {
    const tableNumber = this.order?.tableNumber || 1;
    this.router.navigate(['/menu'], { queryParams: { table: tableNumber } });
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  getItemStatus(item: any): string {
    // In production, each item would have its own status
    return this.order?.status === 'ready' ? 'ready' : 
           this.order?.status === 'preparing' ? 'preparing' : 'pending';
  }

  getItemStatusLabel(item: any): string {
    const status = this.getItemStatus(item);
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      ready: 'Listo'
    };
    return labels[status] || 'Pendiente';
  }

  private showToast(type: string, icon: string, message: string) {
    this.toast = { show: true, type, icon, message };
    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }
}
