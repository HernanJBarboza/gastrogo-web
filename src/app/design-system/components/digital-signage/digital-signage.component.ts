/**
 * GASTROGO - Digital Signage Component
 * Componente para pantallas de TV del restaurante
 * Muestra promociones, menú destacado y anuncios en rotación
 */

import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DisplaySlide {
  id: string;
  type: 'promo' | 'dish' | 'announcement' | 'menu' | 'welcome';
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
  duration?: number; // seconds
  active?: boolean;
}

export interface DisplayConfig {
  restaurantName: string;
  logo?: string;
  theme: 'dark' | 'light';
  slideInterval: number; // seconds
  showClock: boolean;
  showWeather?: boolean;
  weatherTemp?: number;
  weatherIcon?: string;
}

@Component({
  selector: 'app-digital-signage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="signage-container" [class.dark]="config.theme === 'dark'" [class.light]="config.theme === 'light'">
      <!-- Header Bar -->
      <header class="signage-header">
        <div class="header-left">
          <span class="restaurant-logo" *ngIf="config.logo">{{ config.logo }}</span>
          <span class="restaurant-name">{{ config.restaurantName }}</span>
        </div>
        <div class="header-right">
          <div class="weather-widget" *ngIf="config.showWeather">
            <span class="weather-icon">{{ config.weatherIcon || '☀️' }}</span>
            <span class="weather-temp">{{ config.weatherTemp || 22 }}°</span>
          </div>
          <div class="clock-widget" *ngIf="config.showClock">
            {{ currentTime }}
          </div>
        </div>
      </header>

      <!-- Main Slide Area -->
      <main class="signage-main">
        <div class="slide-container" *ngIf="currentSlide">
          <!-- Welcome Slide -->
          <div class="slide slide-welcome" *ngIf="currentSlide.type === 'welcome'"
               [style.background]="currentSlide.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'">
            <div class="welcome-content">
              <span class="welcome-emoji">🍴</span>
              <h1 class="welcome-title">{{ currentSlide.title }}</h1>
              <p class="welcome-subtitle">{{ currentSlide.subtitle }}</p>
              <div class="welcome-features" *ngIf="currentSlide.description">
                <span class="feature">📱 Escaneá el QR</span>
                <span class="feature">🍽️ Pedí desde tu mesa</span>
                <span class="feature">⏱️ Sin esperas</span>
              </div>
            </div>
          </div>

          <!-- Promo Slide -->
          <div class="slide slide-promo" *ngIf="currentSlide.type === 'promo'"
               [style.background-image]="'url(' + currentSlide.imageUrl + ')'"
               [style.background-color]="currentSlide.backgroundColor || '#ff6b35'">
            <div class="promo-overlay"></div>
            <div class="promo-content">
              <span class="promo-badge" *ngIf="currentSlide.badge">{{ currentSlide.badge }}</span>
              <h1 class="promo-title">{{ currentSlide.title }}</h1>
              <p class="promo-subtitle">{{ currentSlide.subtitle }}</p>
              <div class="promo-price" *ngIf="currentSlide.price">
                <span class="price-old" *ngIf="currentSlide.originalPrice">
                  {{ '$' + formatPrice(currentSlide.originalPrice) }}
                </span>
                <span class="price-new">{{ '$' + formatPrice(currentSlide.price) }}</span>
              </div>
            </div>
          </div>

          <!-- Dish Highlight Slide -->
          <div class="slide slide-dish" *ngIf="currentSlide.type === 'dish'">
            <div class="dish-image" *ngIf="currentSlide.imageUrl"
                 [style.background-image]="'url(' + currentSlide.imageUrl + ')'">
            </div>
            <div class="dish-info">
              <span class="dish-badge" *ngIf="currentSlide.badge">{{ currentSlide.badge }}</span>
              <h2 class="dish-name">{{ currentSlide.title }}</h2>
              <p class="dish-description">{{ currentSlide.description }}</p>
              <div class="dish-price">
                {{ '$' + formatPrice(currentSlide.price || 0) }}
              </div>
            </div>
          </div>

          <!-- Menu Slide -->
          <div class="slide slide-menu" *ngIf="currentSlide.type === 'menu'">
            <h2 class="menu-title">{{ currentSlide.title }}</h2>
            <div class="menu-grid">
              <div class="menu-item" *ngFor="let item of menuItems">
                <span class="menu-item-name">{{ item.name }}</span>
                <span class="menu-item-dots"></span>
                <span class="menu-item-price">{{ '$' + formatPrice(item.price) }}</span>
              </div>
            </div>
          </div>

          <!-- Announcement Slide -->
          <div class="slide slide-announcement" *ngIf="currentSlide.type === 'announcement'"
               [style.background]="currentSlide.backgroundColor || 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'">
            <div class="announcement-content">
              <span class="announcement-icon">📢</span>
              <h1 class="announcement-title">{{ currentSlide.title }}</h1>
              <p class="announcement-text">{{ currentSlide.description }}</p>
            </div>
          </div>
        </div>

        <!-- Slide Indicators -->
        <div class="slide-indicators">
          <span 
            *ngFor="let slide of slides; let i = index"
            class="indicator"
            [class.active]="i === currentIndex"
            (click)="goToSlide(i)"
          ></span>
        </div>
      </main>

      <!-- Footer Ticker -->
      <footer class="signage-footer">
        <div class="ticker-wrapper">
          <div class="ticker-content" [style.animation-duration]="tickerDuration + 's'">
            <span *ngFor="let msg of tickerMessages" class="ticker-item">
              {{ msg }} &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </footer>

      <!-- QR Code Overlay -->
      <div class="qr-overlay" *ngIf="showQR">
        <div class="qr-content">
          <div class="qr-code">
            <div class="qr-placeholder">📱</div>
            <span>Escaneá para ver el menú</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signage-container {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .signage-container.dark {
      background: #0a0a0f;
      color: white;
    }

    .signage-container.light {
      background: #f8f9fa;
      color: #1a1a2e;
    }

    /* Header */
    .signage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      z-index: 10;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .restaurant-logo {
      font-size: 40px;
    }

    .restaurant-name {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .weather-widget {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
    }

    .weather-icon {
      font-size: 32px;
    }

    .clock-widget {
      font-size: 32px;
      font-weight: 300;
      font-variant-numeric: tabular-nums;
    }

    /* Main Slide Area */
    .signage-main {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    .slide-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .slide {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.8s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(1.02); }
      to { opacity: 1; transform: scale(1); }
    }

    /* Welcome Slide */
    .slide-welcome {
      text-align: center;
      color: white;
    }

    .welcome-content {
      max-width: 800px;
      padding: 40px;
    }

    .welcome-emoji {
      font-size: 80px;
      display: block;
      margin-bottom: 20px;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }

    .welcome-title {
      font-size: 72px;
      font-weight: 800;
      margin: 0 0 16px 0;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .welcome-subtitle {
      font-size: 28px;
      opacity: 0.9;
      margin: 0 0 40px 0;
    }

    .welcome-features {
      display: flex;
      justify-content: center;
      gap: 40px;
    }

    .feature {
      font-size: 20px;
      background: rgba(255, 255, 255, 0.2);
      padding: 12px 24px;
      border-radius: 30px;
      backdrop-filter: blur(10px);
    }

    /* Promo Slide */
    .slide-promo {
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .promo-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%);
    }

    .promo-content {
      position: relative;
      z-index: 1;
      color: white;
      text-align: center;
      padding: 40px;
    }

    .promo-badge {
      display: inline-block;
      background: #ff4757;
      color: white;
      padding: 10px 30px;
      border-radius: 30px;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .promo-title {
      font-size: 80px;
      font-weight: 800;
      margin: 0 0 16px 0;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    }

    .promo-subtitle {
      font-size: 32px;
      opacity: 0.9;
      margin: 0 0 32px 0;
    }

    .promo-price {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }

    .price-old {
      font-size: 36px;
      text-decoration: line-through;
      opacity: 0.6;
    }

    .price-new {
      font-size: 72px;
      font-weight: 800;
      color: #ffd32a;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    /* Dish Slide */
    .slide-dish {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: 100%;
    }

    .dish-image {
      background-size: cover;
      background-position: center;
    }

    .dish-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
    }

    .dish-badge {
      display: inline-block;
      background: #ff9f43;
      color: #1a1a2e;
      padding: 8px 20px;
      border-radius: 20px;
      font-size: 18px;
      font-weight: 700;
      width: fit-content;
      margin-bottom: 24px;
    }

    .dish-name {
      font-size: 56px;
      font-weight: 800;
      margin: 0 0 20px 0;
    }

    .dish-description {
      font-size: 24px;
      opacity: 0.8;
      line-height: 1.6;
      margin: 0 0 32px 0;
    }

    .dish-price {
      font-size: 48px;
      font-weight: 700;
      color: #ffd32a;
    }

    /* Menu Slide */
    .slide-menu {
      flex-direction: column;
      padding: 60px;
      background: linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%);
      color: white;
    }

    .menu-title {
      font-size: 48px;
      font-weight: 700;
      margin: 0 0 40px 0;
      text-align: center;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px 60px;
      max-width: 1200px;
    }

    .menu-item {
      display: flex;
      align-items: baseline;
      font-size: 24px;
      gap: 12px;
    }

    .menu-item-name {
      white-space: nowrap;
    }

    .menu-item-dots {
      flex: 1;
      border-bottom: 2px dotted rgba(255, 255, 255, 0.3);
    }

    .menu-item-price {
      font-weight: 600;
      color: #ffd32a;
    }

    /* Announcement Slide */
    .slide-announcement {
      text-align: center;
      color: white;
    }

    .announcement-content {
      max-width: 900px;
      padding: 40px;
    }

    .announcement-icon {
      font-size: 80px;
      display: block;
      margin-bottom: 24px;
    }

    .announcement-title {
      font-size: 64px;
      font-weight: 800;
      margin: 0 0 24px 0;
    }

    .announcement-text {
      font-size: 28px;
      opacity: 0.9;
      line-height: 1.5;
      margin: 0;
    }

    /* Slide Indicators */
    .slide-indicators {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 10;
    }

    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      transition: all 0.3s;
    }

    .indicator.active {
      width: 36px;
      border-radius: 6px;
      background: white;
    }

    /* Footer Ticker */
    .signage-footer {
      background: rgba(0, 0, 0, 0.8);
      padding: 16px 0;
      overflow: hidden;
    }

    .ticker-wrapper {
      overflow: hidden;
    }

    .ticker-content {
      display: flex;
      white-space: nowrap;
      animation: ticker linear infinite;
    }

    @keyframes ticker {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .ticker-item {
      font-size: 20px;
      color: white;
      opacity: 0.9;
    }

    /* QR Overlay */
    .qr-overlay {
      position: absolute;
      bottom: 100px;
      right: 40px;
      z-index: 20;
    }

    .qr-content {
      background: white;
      padding: 20px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .qr-placeholder {
      font-size: 60px;
      margin-bottom: 8px;
    }

    .qr-content span {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    /* Light theme overrides */
    .light .signage-header {
      background: rgba(255, 255, 255, 0.9);
    }

    .light .signage-footer {
      background: rgba(0, 0, 0, 0.9);
    }
  `]
})
export class DigitalSignageComponent implements OnInit, OnDestroy {
  @Input() slides: DisplaySlide[] = [];
  @Input() config: DisplayConfig = {
    restaurantName: 'GastroGo Restaurant',
    logo: '🍴',
    theme: 'dark',
    slideInterval: 8,
    showClock: true,
    showWeather: true,
    weatherTemp: 24,
    weatherIcon: '☀️'
  };
  @Input() tickerMessages: string[] = [
    'WiFi Gratis: GastroGo_Guest',
    '¡Todos los viernes 2x1 en cervezas artesanales!',
    'Seguinos en Instagram @gastrogo.oficial',
    'Pedí desde tu mesa escaneando el QR',
    'Happy Hour de 18 a 20hs'
  ];
  @Input() showQR = true;

  @Output() slideChange = new EventEmitter<number>();

  currentSlide?: DisplaySlide;
  currentIndex = 0;
  currentTime = '';
  tickerDuration = 30;

  menuItems = [
    { name: 'Empanadas (x3)', price: 2800 },
    { name: 'Provoleta', price: 3500 },
    { name: 'Bife de Chorizo', price: 8900 },
    { name: 'Entraña', price: 7800 },
    { name: 'Ensalada César', price: 4200 },
    { name: 'Papas Fritas', price: 2500 },
    { name: 'Flan Casero', price: 2800 },
    { name: 'Tiramisú', price: 3200 },
  ];

  private slideInterval?: ReturnType<typeof setInterval>;
  private clockInterval?: ReturnType<typeof setInterval>;

  // Default slides if none provided
  private defaultSlides: DisplaySlide[] = [
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
      id: 'menu-1',
      type: 'menu',
      title: '📋 Nuestro Menú',
    },
    {
      id: 'announcement-1',
      type: 'announcement',
      title: '¡Nueva Carta de Postres!',
      description: 'Descubrí nuestros nuevos postres artesanales. Tiramisú, Volcán de Chocolate y más.',
      backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  ];

  ngOnInit() {
    if (!this.slides || this.slides.length === 0) {
      this.slides = this.defaultSlides;
    }
    this.currentSlide = this.slides[0];
    this.startSlideshow();
    this.startClock();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  private startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.config.slideInterval * 1000);
  }

  private startClock() {
    this.updateClock();
    this.clockInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  private updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.currentSlide = this.slides[this.currentIndex];
    this.slideChange.emit(this.currentIndex);
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.currentSlide = this.slides[this.currentIndex];
    this.slideChange.emit(this.currentIndex);
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.currentSlide = this.slides[index];
    this.slideChange.emit(index);

    // Reset interval
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startSlideshow();
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-AR');
  }
}
