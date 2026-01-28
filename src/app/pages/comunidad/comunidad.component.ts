import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post {
  id: number;
  usuario: string;
  avatar: string;
  contenido: string;
  imagen: string;
  likes: number;
  comentarios: number;
  fecha: string;
  liked: boolean;
}

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.css'
})
export class ComunidadComponent {
  nuevoPost = '';
  posts: Post[] = [
    {
      id: 1,
      usuario: 'María García',
      avatar: '👩‍🍳',
      contenido: '¡Acabo de preparar mi primera paella! Gracias a la receta de GastroGo quedó perfecta 🥘',
      imagen: '🥘',
      likes: 45,
      comentarios: 12,
      fecha: 'Hace 2 horas',
      liked: false
    },
    {
      id: 2,
      usuario: 'Carlos López',
      avatar: '👨‍🍳',
      contenido: 'Los ingredientes que pedí llegaron súper frescos. ¡Recomiendo totalmente el servicio! 🛒',
      imagen: '🥬',
      likes: 32,
      comentarios: 8,
      fecha: 'Hace 5 horas',
      liked: true
    },
    {
      id: 3,
      usuario: 'Ana Martínez',
      avatar: '👩',
      contenido: 'Descubrí un restaurante increíble gracias a los menús digitales. El sushi de Sushi Zen es el mejor 🍣',
      imagen: '🍣',
      likes: 67,
      comentarios: 23,
      fecha: 'Hace 1 día',
      liked: false
    },
    {
      id: 4,
      usuario: 'Roberto Sánchez',
      avatar: '👨',
      contenido: 'Tip del día: añadan un poco de limón al guacamole para que no se oxide tan rápido 🥑',
      imagen: '🥑',
      likes: 89,
      comentarios: 15,
      fecha: 'Hace 2 días',
      liked: true
    }
  ];

  darLike(post: Post) {
    if (post.liked) {
      post.likes--;
    } else {
      post.likes++;
    }
    post.liked = !post.liked;
  }

  publicar() {
    if (this.nuevoPost.trim()) {
      this.posts.unshift({
        id: Date.now(),
        usuario: 'Tú',
        avatar: '😊',
        contenido: this.nuevoPost,
        imagen: '',
        likes: 0,
        comentarios: 0,
        fecha: 'Ahora',
        liked: false
      });
      this.nuevoPost = '';
    }
  }
}
