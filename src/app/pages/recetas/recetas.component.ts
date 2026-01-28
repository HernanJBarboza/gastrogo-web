import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Receta {
  id: number;
  nombre: string;
  imagen: string;
  tiempo: string;
  dificultad: string;
  categoria: string;
}

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recetas.component.html',
  styleUrl: './recetas.component.css'
})
export class RecetasComponent implements OnInit {
  recetas: Receta[] = [];
  categorias = ['Todas', 'Entrantes', 'Principales', 'Postres', 'Bebidas'];
  categoriaActiva = 'Todas';

  ngOnInit() {
    this.cargarRecetas();
  }

  cargarRecetas() {
    // Datos de ejemplo - en producción vendrían del backend
    this.recetas = [
      { id: 1, nombre: 'Paella Valenciana', imagen: '🥘', tiempo: '45 min', dificultad: 'Media', categoria: 'Principales' },
      { id: 2, nombre: 'Gazpacho Andaluz', imagen: '🍅', tiempo: '15 min', dificultad: 'Fácil', categoria: 'Entrantes' },
      { id: 3, nombre: 'Tortilla Española', imagen: '🥚', tiempo: '30 min', dificultad: 'Fácil', categoria: 'Principales' },
      { id: 4, nombre: 'Crema Catalana', imagen: '🍮', tiempo: '40 min', dificultad: 'Media', categoria: 'Postres' },
      { id: 5, nombre: 'Sangría', imagen: '🍷', tiempo: '10 min', dificultad: 'Fácil', categoria: 'Bebidas' },
      { id: 6, nombre: 'Croquetas de Jamón', imagen: '🍗', tiempo: '60 min', dificultad: 'Alta', categoria: 'Entrantes' },
      { id: 7, nombre: 'Pulpo a la Gallega', imagen: '🐙', tiempo: '50 min', dificultad: 'Media', categoria: 'Principales' },
      { id: 8, nombre: 'Flan de Huevo', imagen: '🍮', tiempo: '35 min', dificultad: 'Fácil', categoria: 'Postres' },
    ];
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaActiva = categoria;
  }

  get recetasFiltradas() {
    if (this.categoriaActiva === 'Todas') {
      return this.recetas;
    }
    return this.recetas.filter(r => r.categoria === this.categoriaActiva);
  }
}
