import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecetasComponent } from './pages/recetas/recetas.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { MenusComponent } from './pages/menus/menus.component';
import { ComunidadComponent } from './pages/comunidad/comunidad.component';
import { MenuComponent } from './pages/menu/menu.component';
import { KitchenComponent } from './pages/kitchen/kitchen.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recetas', component: RecetasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'menus', component: MenusComponent },
  { path: 'comunidad', component: ComunidadComponent },
  
  // GastroGO - QR Platform
  { path: 'menu', component: MenuComponent },           // Menú interactivo para clientes QR
  { path: 'kitchen', component: KitchenComponent },     // Kitchen Display System (KDS)
  
  { path: '**', redirectTo: '' }
];
