import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecetasComponent } from './pages/recetas/recetas.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { MenusComponent } from './pages/menus/menus.component';
import { ComunidadComponent } from './pages/comunidad/comunidad.component';
import { MenuComponent } from './pages/menu/menu.component';
import { KitchenComponent } from './pages/kitchen/kitchen.component';
import { OrderTrackingComponent } from './pages/tracking/tracking.component';
import { DisplayComponent } from './pages/display/display.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recetas', component: RecetasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'menus', component: MenusComponent },
  { path: 'comunidad', component: ComunidadComponent },
  
  // GastroGO - QR Platform
  { path: 'menu', component: MenuComponent },                     // Menú interactivo para clientes QR
  { path: 'kitchen', component: KitchenComponent },               // Kitchen Display System (KDS)
  { path: 'track/:orderId', component: OrderTrackingComponent },  // Tracking de pedido para cliente
  { path: 'display/:restaurantId', component: DisplayComponent }, // Digital Signage para TVs
  { path: 'display', component: DisplayComponent },               // Display por defecto
  
  { path: '**', redirectTo: '' }
];
