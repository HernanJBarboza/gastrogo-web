import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  features = [
    { icon: '🍽️', title: 'Recetas', description: 'Descubre recetas increíbles de chefs profesionales', link: '/recetas' },
    { icon: '🛒', title: 'Productos', description: 'Compra ingredientes frescos y de calidad', link: '/productos' },
    { icon: '📋', title: 'Menús', description: 'Explora menús digitales de restaurantes', link: '/menus' },
    { icon: '👨‍🍳', title: 'Comunidad', description: 'Comparte experiencias gastronómicas', link: '/comunidad' }
  ];
}
