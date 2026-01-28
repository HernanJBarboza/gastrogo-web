/**
 * GASTROGO - Kitchen Display System (KDS)
 * Interfaz Dark Mode para cocina con pedidos en tiempo real
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  OrderCardComponent, 
  Order, 
  OrderStatus,
  ButtonComponent 
} from '../../design-system';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, OrderCardComponent, ButtonComponent],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.css'
})
export class KitchenComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filterStatus: OrderStatus | 'all' = 'all';
  soundEnabled = true;
  
  private refreshInterval?: ReturnType<typeof setInterval>;

  // Datos de ejemplo (en producción vendría del WebSocket)
  private mockOrders: Order[] = [
    {
      id: 'ord-abc123',
      table_number: 5,
      status: 'created',
      created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
      total: 15800,
      items: [
        { id: 'item-1', dish_name: 'Provoleta', quantity: 1, notes: 'Sin orégano' },
        { id: 'item-2', dish_name: 'Bife de Chorizo', quantity: 2, modifiers: ['Jugoso', 'Papas fritas'] },
      ],
    },
    {
      id: 'ord-def456',
      table_number: 3,
      status: 'preparing',
      created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 min ago
      total: 22300,
      items: [
        { id: 'item-3', dish_name: 'Empanadas Criollas', quantity: 6 },
        { id: 'item-4', dish_name: 'Entraña', quantity: 1, modifiers: ['A punto'] },
        { id: 'item-5', dish_name: 'Ñoquis de Papa', quantity: 1, modifiers: ['Bolognesa'] },
      ],
      notes: 'Cliente alérgico a mariscos',
    },
    {
      id: 'ord-ghi789',
      table_number: 8,
      status: 'preparing',
      created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 min ago (urgente)
      total: 18500,
      items: [
        { id: 'item-6', dish_name: 'Asado de Tira', quantity: 2 },
        { id: 'item-7', dish_name: 'Ensalada Mixta', quantity: 2 },
      ],
    },
    {
      id: 'ord-jkl012',
      table_number: 1,
      status: 'confirmed',
      created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 min ago
      total: 7400,
      items: [
        { id: 'item-8', dish_name: 'Tiramisú', quantity: 2 },
        { id: 'item-9', dish_name: 'Café Espresso', quantity: 2 },
      ],
    },
    {
      id: 'ord-mno345',
      table_number: 10,
      status: 'ready',
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
      total: 12500,
      items: [
        { id: 'item-10', dish_name: 'Bife de Chorizo', quantity: 1, modifiers: ['Cocido', 'Puré'] },
      ],
    },
  ];

  get filteredOrders(): Order[] {
    if (this.filterStatus === 'all') {
      return this.orders.filter(o => 
        !['delivered', 'paid', 'cancelled'].includes(o.status)
      );
    }
    return this.orders.filter(o => o.status === this.filterStatus);
  }

  get ordersByStatus(): Record<string, Order[]> {
    const groups: Record<string, Order[]> = {
      created: [],
      confirmed: [],
      preparing: [],
      ready: [],
    };
    
    this.orders.forEach(order => {
      if (groups[order.status]) {
        groups[order.status].push(order);
      }
    });
    
    return groups;
  }

  get pendingCount(): number {
    return this.orders.filter(o => o.status === 'created').length;
  }

  get preparingCount(): number {
    return this.orders.filter(o => o.status === 'preparing').length;
  }

  get readyCount(): number {
    return this.orders.filter(o => o.status === 'ready').length;
  }

  ngOnInit(): void {
    // Cargar pedidos iniciales
    this.orders = [...this.mockOrders];
    
    // Simular actualización en tiempo real
    this.startAutoRefresh();
    
    // Activar dark mode
    document.body.setAttribute('data-theme', 'dark');
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    document.body.removeAttribute('data-theme');
  }

  private startAutoRefresh(): void {
    // En producción sería WebSocket
    this.refreshInterval = setInterval(() => {
      // Simular nuevos pedidos ocasionalmente
      if (Math.random() > 0.9) {
        this.addMockOrder();
      }
    }, 10000);
  }

  private addMockOrder(): void {
    const newOrder: Order = {
      id: `ord-${Math.random().toString(36).substr(2, 9)}`,
      table_number: Math.floor(Math.random() * 15) + 1,
      status: 'created',
      created_at: new Date().toISOString(),
      total: Math.floor(Math.random() * 20000) + 5000,
      items: [
        { 
          id: `item-${Math.random().toString(36).substr(2, 9)}`,
          dish_name: ['Provoleta', 'Empanadas', 'Bife de Chorizo', 'Ñoquis'][Math.floor(Math.random() * 4)],
          quantity: Math.floor(Math.random() * 3) + 1,
        },
      ],
    };
    
    this.orders.unshift(newOrder);
    this.playNotification();
  }

  onStatusChange(event: { orderId: string; status: OrderStatus }): void {
    const order = this.orders.find(o => o.id === event.orderId);
    if (order) {
      order.status = event.status;
      
      if (event.status === 'ready') {
        this.playReadySound();
      }
    }
  }

  onPrint(order: Order): void {
    console.log('Imprimiendo pedido:', order.id);
    // Integración con impresora térmica
  }

  setFilter(status: OrderStatus | 'all'): void {
    this.filterStatus = status;
  }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
  }

  private playNotification(): void {
    if (this.soundEnabled) {
      // En producción: new Audio('/assets/sounds/new-order.mp3').play();
      console.log('🔔 Nuevo pedido');
    }
  }

  private playReadySound(): void {
    if (this.soundEnabled) {
      // En producción: new Audio('/assets/sounds/order-ready.mp3').play();
      console.log('✅ Pedido listo');
    }
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
