import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RecetasComponent } from './pages/recetas/recetas.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { MenusComponent } from './pages/menus/menus.component';
import { ComunidadComponent } from './pages/comunidad/comunidad.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recetas', component: RecetasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'menus', component: MenusComponent },
  { path: 'comunidad', component: ComunidadComponent },
  { path: '**', redirectTo: '' }
];
