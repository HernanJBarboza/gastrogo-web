import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Menu {
  id: number;
  restaurante: string;
  logo: string;
  tipo: string;
  items: { nombre: string; precio: number; descripcion: string }[];
}

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.css'
})
export class MenusComponent implements OnInit {
  menus: Menu[] = [];
  menuSeleccionado: Menu | null = null;

  ngOnInit() {
    this.cargarMenus();
  }

  cargarMenus() {
    this.menus = [
      {
        id: 1,
        restaurante: 'La Parrilla Dorada',
        logo: '🥩',
        tipo: 'Carnes',
        items: [
          { nombre: 'Bife de Chorizo', precio: 25.00, descripcion: 'Corte premium 400g con guarnición' },
          { nombre: 'Asado de Tira', precio: 22.00, descripcion: 'Costillas a la parrilla 500g' },
          { nombre: 'Entraña', precio: 20.00, descripcion: 'Corte jugoso 350g' },
        ]
      },
      {
        id: 2,
        restaurante: 'Mar Azul',
        logo: '🐟',
        tipo: 'Mariscos',
        items: [
          { nombre: 'Ceviche Mixto', precio: 18.00, descripcion: 'Pescado y mariscos frescos' },
          { nombre: 'Paella Marinera', precio: 28.00, descripcion: 'Para 2 personas' },
          { nombre: 'Pulpo al Olivo', precio: 24.00, descripcion: 'Con papas andinas' },
        ]
      },
      {
        id: 3,
        restaurante: 'Pasta e Basta',
        logo: '🍝',
        tipo: 'Italiana',
        items: [
          { nombre: 'Lasagna Clásica', precio: 16.00, descripcion: 'Con bechamel y bolognesa' },
          { nombre: 'Ravioles de Ricota', precio: 14.00, descripcion: 'Con salsa pomodoro' },
          { nombre: 'Risotto ai Funghi', precio: 18.00, descripcion: 'Con hongos porcini' },
        ]
      },
      {
        id: 4,
        restaurante: 'Sushi Zen',
        logo: '🍣',
        tipo: 'Japonesa',
        items: [
          { nombre: 'Combo Tokio', precio: 35.00, descripcion: '20 piezas variadas' },
          { nombre: 'Ramen de Cerdo', precio: 16.00, descripcion: 'Caldo tonkotsu' },
          { nombre: 'Tempura Mix', precio: 14.00, descripcion: 'Vegetales y langostinos' },
        ]
      },
    ];
  }

  verMenu(menu: Menu) {
    this.menuSeleccionado = menu;
  }

  cerrarMenu() {
    this.menuSeleccionado = null;
  }
}
