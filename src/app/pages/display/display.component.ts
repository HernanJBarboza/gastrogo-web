/**
 * GASTROGO - Display TV Page
 * Página fullscreen para pantallas de TV en el restaurante
 * Ruta: /display/:restaurantId
 */

import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { 
  DigitalSignageComponent, 
  DisplaySlide, 
  DisplayConfig 
} from '../../design-system';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule, DigitalSignageComponent],
  template: `
    <!-- Loading State -->
    <div class="loading-screen" *ngIf="loading">
      <div class="loading-content">
        <span class="loading-logo">🍴</span>
        <span class="loading-text">Cargando Display...</span>
        <div class="loading-bar">
          <div class="loading-progress"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div class="error-screen" *ngIf="error && !loading">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <h2>Error de Conexión</h2>
        <p>{{ error }}</p>
        <button class="retry-btn" (click)="retryConnection()">
          🔄 Reintentar
        </button>
      </div>
    </div>

    <!-- Digital Signage Display -->
    <app-digital-signage
      *ngIf="!loading && !error"
      [slides]="slides"
      [config]="displayConfig"
      [tickerMessages]="tickerMessages"
      [showQR]="showQR"
      (slideChange)="onSlideChange($event)"
    ></app-digital-signage>

    <!-- Admin Controls (hidden by default, show with 'A' key) -->
    <div class="admin-controls" *ngIf="showAdminControls">
      <div class="admin-panel">
        <h3>🔧 Control de Display</h3>
        
        <div class="control-group">
          <label>Tema</label>
          <div class="toggle-group">
            <button 
              [class.active]="displayConfig.theme === 'dark'"
              (click)="setTheme('dark')"
            >🌙 Oscuro</button>
            <button 
              [class.active]="displayConfig.theme === 'light'"
              (click)="setTheme('light')"
            >☀️ Claro</button>
          </div>
        </div>

        <div class="control-group">
          <label>Intervalo de Slides (seg)</label>
          <input 
            type="range" 
            min="3" 
            max="30" 
            [value]="displayConfig.slideInterval"
            (input)="setInterval($event)"
          >
          <span class="value">{{ displayConfig.slideInterval }}s</span>
        </div>

        <div class="control-group">
          <label>Mostrar QR</label>
          <button 
            class="toggle-btn"
            [class.active]="showQR"
            (click)="toggleQR()"
          >
            {{ showQR ? '✓ Visible' : '✕ Oculto' }}
          </button>
        </div>

        <div class="control-group">
          <label>Mostrar Reloj</label>
          <button 
            class="toggle-btn"
            [class.active]="displayConfig.showClock"
            (click)="toggleClock()"
          >
            {{ displayConfig.showClock ? '✓ Visible' : '✕ Oculto' }}
          </button>
        </div>

        <div class="control-info">
          <p>Restaurant ID: {{ restaurantId }}</p>
          <p>Slide Actual: {{ currentSlideIndex + 1 }} / {{ slides.length }}</p>
          <p>Presiona 'A' para ocultar</p>
        </div>

        <button class="fullscreen-btn" (click)="toggleFullscreen()">
          ⛶ Pantalla Completa
        </button>
      </div>
    </div>

    <!-- Connection Status -->
    <div class="connection-status" [class.connected]="isConnected" [class.disconnected]="!isConnected">
      <span class="status-dot"></span>
      <span class="status-text">{{ isConnected ? 'Conectado' : 'Reconectando...' }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    /* Loading Screen */
    .loading-screen {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .loading-content {
      text-align: center;
      color: white;
    }

    .loading-logo {
      font-size: 80px;
      display: block;
      margin-bottom: 24px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .loading-text {
      font-size: 24px;
      margin-bottom: 32px;
      display: block;
    }

    .loading-bar {
      width: 200px;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
      margin: 0 auto;
    }

    .loading-progress {
      width: 40%;
      height: 100%;
      background: white;
      border-radius: 2px;
      animation: loading 1.5s ease-in-out infinite;
    }

    @keyframes loading {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(350%); }
    }

    /* Error Screen */
    .error-screen {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .error-content {
      text-align: center;
      color: white;
    }

    .error-icon {
      font-size: 80px;
      display: block;
      margin-bottom: 24px;
    }

    .error-content h2 {
      font-size: 32px;
      margin: 0 0 12px 0;
    }

    .error-content p {
      font-size: 18px;
      opacity: 0.8;
      margin: 0 0 32px 0;
    }

    .retry-btn {
      background: white;
      color: #1a1a2e;
      border: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .retry-btn:hover {
      transform: scale(1.05);
    }

    /* Admin Controls */
    .admin-controls {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 320px;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(20px);
      z-index: 1000;
      padding: 24px;
      animation: slideIn 0.3s ease;
      overflow-y: auto;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .admin-panel h3 {
      color: white;
      margin: 0 0 24px 0;
      font-size: 20px;
    }

    .control-group {
      margin-bottom: 20px;
    }

    .control-group label {
      display: block;
      color: #999;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .toggle-group {
      display: flex;
      gap: 8px;
    }

    .toggle-group button {
      flex: 1;
      padding: 10px;
      border: 2px solid #333;
      background: transparent;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .toggle-group button.active {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.2);
    }

    input[type="range"] {
      width: 100%;
      margin-bottom: 8px;
    }

    .value {
      color: white;
      font-size: 14px;
    }

    .toggle-btn {
      width: 100%;
      padding: 10px;
      border: 2px solid #333;
      background: transparent;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .toggle-btn.active {
      border-color: #4CAF50;
      background: rgba(76, 175, 80, 0.2);
    }

    .control-info {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #333;
    }

    .control-info p {
      color: #666;
      font-size: 12px;
      margin: 4px 0;
    }

    .fullscreen-btn {
      width: 100%;
      padding: 14px;
      margin-top: 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .fullscreen-btn:hover {
      background: #5a6fd6;
    }

    /* Connection Status */
    .connection-status {
      position: fixed;
      bottom: 20px;
      left: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .connection-status:hover {
      opacity: 1;
    }

    .connection-status.disconnected {
      opacity: 1;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .connected .status-dot {
      background: #4CAF50;
    }

    .disconnected .status-dot {
      background: #ff9800;
      animation: blink 0.5s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .status-text {
      color: white;
      font-size: 12px;
    }
  `]
})
export class DisplayComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);

  restaurantId: string = '';
  loading = true;
  error = '';
  isConnected = true;
  showAdminControls = false;
  showQR = true;
  currentSlideIndex = 0;

  displayConfig: DisplayConfig = {
    restaurantName: 'GastroGo Restaurant',
    logo: '🍴',
    theme: 'dark',
    slideInterval: 8,
    showClock: true,
    showWeather: true,
    weatherTemp: 24,
    weatherIcon: '☀️'
  };

  slides: DisplaySlide[] = [];
  tickerMessages: string[] = [];

  private ws?: WebSocket;
  private reconnectTimeout?: ReturnType<typeof setTimeout>;

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      case 'a':
        this.showAdminControls = !this.showAdminControls;
        break;
      case 'f':
        this.toggleFullscreen();
        break;
      case 'q':
        this.toggleQR();
        break;
      case 'arrowright':
        // Manual next slide
        break;
      case 'arrowleft':
        // Manual prev slide
        break;
    }
  }

  ngOnInit() {
    this.restaurantId = this.route.snapshot.paramMap.get('restaurantId') || 'default';
    this.loadDisplayConfig();
  }

  ngOnDestroy() {
    this.ws?.close();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
  }

  private loadDisplayConfig() {
    // Simulate API call to load restaurant-specific config
    setTimeout(() => {
      // Default slides for demo
      this.slides = [
        {
          id: 'welcome',
          type: 'welcome',
          title: 'Bienvenidos',
          subtitle: 'Pedí desde tu mesa, sin esperas',
          description: 'features',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
          id: 'promo-1',
          type: 'promo',
          title: '2x1 en Cervezas',
          subtitle: 'Todos los jueves de 19 a 22hs',
          badge: '🍺 PROMO',
          imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1920',
          price: 1500,
          originalPrice: 3000
        },
        {
          id: 'dish-1',
          type: 'dish',
          title: 'Bife de Chorizo',
          description: '400g de carne premium a la parrilla, acompañado de papas rústicas y salsa criolla casera.',
          badge: '⭐ Chef Recomienda',
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1920',
          price: 8900
        },
        {
          id: 'promo-2',
          type: 'promo',
          title: 'Almuerzo Ejecutivo',
          subtitle: 'De Lunes a Viernes 12 a 15hs',
          badge: '💼 ESPECIAL',
          backgroundColor: '#2d3436',
          price: 4500
        },
        {
          id: 'menu-1',
          type: 'menu',
          title: '📋 Nuestro Menú',
        },
        {
          id: 'dish-2',
          type: 'dish',
          title: 'Tiramisú Casero',
          description: 'Postre italiano tradicional con mascarpone, café espresso y cacao amargo.',
          badge: '🍰 Nuevo',
          imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1920',
          price: 3200
        },
        {
          id: 'announcement-1',
          type: 'announcement',
          title: '¡Reservá tu Mesa!',
          description: 'Para grupos de más de 6 personas, reservá con anticipación por WhatsApp.',
          backgroundColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        }
      ];

      this.tickerMessages = [
        '📶 WiFi Gratis: GastroGo_Guest',
        '🍺 ¡Todos los jueves 2x1 en cervezas artesanales!',
        '📸 Seguinos en Instagram @gastrogo.oficial',
        '📱 Pedí desde tu mesa escaneando el QR',
        '🕐 Happy Hour de 18 a 20hs',
        '🎉 Reservas para eventos: info@gastrogo.com',
        '💳 Aceptamos todas las tarjetas y MercadoPago'
      ];

      this.loading = false;
      this.connectWebSocket();
    }, 1500);
  }

  private connectWebSocket() {
    // In production, connect to real WebSocket for live updates
    this.isConnected = true;
    
    // Simulate occasional disconnections for demo
    // In production this would be actual WebSocket connection
  }

  retryConnection() {
    this.loading = true;
    this.error = '';
    this.loadDisplayConfig();
  }

  onSlideChange(index: number) {
    this.currentSlideIndex = index;
  }

  setTheme(theme: 'dark' | 'light') {
    this.displayConfig = { ...this.displayConfig, theme };
  }

  setInterval(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.displayConfig = { ...this.displayConfig, slideInterval: value };
  }

  toggleQR() {
    this.showQR = !this.showQR;
  }

  toggleClock() {
    this.displayConfig = { 
      ...this.displayConfig, 
      showClock: !this.displayConfig.showClock 
    };
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}
