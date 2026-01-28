import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  categoria: string;
  unidad: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  carrito: { producto: Producto; cantidad: number }[] = [];
  categorias = ['Todos', 'Frutas', 'Verduras', 'Carnes', 'Lácteos', 'Especias'];
  categoriaActiva = 'Todos';

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productos = [
      { id: 1, nombre: 'Tomates', imagen: '🍅', precio: 2.50, categoria: 'Verduras', unidad: 'kg' },
      { id: 2, nombre: 'Manzanas', imagen: '🍎', precio: 3.00, categoria: 'Frutas', unidad: 'kg' },
      { id: 3, nombre: 'Pollo', imagen: '🍗', precio: 8.50, categoria: 'Carnes', unidad: 'kg' },
      { id: 4, nombre: 'Leche', imagen: '🥛', precio: 1.20, categoria: 'Lácteos', unidad: 'litro' },
      { id: 5, nombre: 'Queso', imagen: '🧀', precio: 12.00, categoria: 'Lácteos', unidad: 'kg' },
      { id: 6, nombre: 'Ajo', imagen: '🧄', precio: 4.00, categoria: 'Especias', unidad: 'kg' },
      { id: 7, nombre: 'Cebolla', imagen: '🧅', precio: 1.80, categoria: 'Verduras', unidad: 'kg' },
      { id: 8, nombre: 'Plátanos', imagen: '🍌', precio: 1.50, categoria: 'Frutas', unidad: 'kg' },
      { id: 9, nombre: 'Carne de Res', imagen: '🥩', precio: 15.00, categoria: 'Carnes', unidad: 'kg' },
      { id: 10, nombre: 'Huevos', imagen: '🥚', precio: 3.50, categoria: 'Lácteos', unidad: 'docena' },
      { id: 11, nombre: 'Pimientos', imagen: '🌶️', precio: 4.50, categoria: 'Verduras', unidad: 'kg' },
      { id: 12, nombre: 'Naranjas', imagen: '🍊', precio: 2.00, categoria: 'Frutas', unidad: 'kg' },
    ];
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaActiva = categoria;
  }

  get productosFiltrados() {
    if (this.categoriaActiva === 'Todos') {
      return this.productos;
    }
    return this.productos.filter(p => p.categoria === this.categoriaActiva);
  }

  agregarAlCarrito(producto: Producto) {
    const item = this.carrito.find(c => c.producto.id === producto.id);
    if (item) {
      item.cantidad++;
    } else {
      this.carrito.push({ producto, cantidad: 1 });
    }
  }

  get totalCarrito() {
    return this.carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }

  get cantidadCarrito() {
    return this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
  }
}
