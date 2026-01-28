/**
 * GASTROGO - Menú Interactivo
 * Página de menú para clientes con QR
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { 
  CategoryTabsComponent, 
  DishCardComponent, 
  DishModalComponent,
  ButtonComponent,
  Category,
  Dish,
  CartItem 
} from '../../design-system';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    CategoryTabsComponent,
    DishCardComponent,
    DishModalComponent,
    ButtonComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  // Estado
  restaurantName = 'La Parrilla del Puerto';
  tableNumber?: number;
  categories: Category[] = [];
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  selectedCategory?: string;
  selectedDish?: Dish;
  isModalOpen = false;
  cart: CartState = { items: [], totalItems: 0, totalPrice: 0 };
  isCartOpen = false;

  // Datos de ejemplo (normalmente vendría del API)
  private mockCategories: Category[] = [
    { id: 'cat-1', name: 'Entradas', icon: '🥗', dish_count: 6 },
    { id: 'cat-2', name: 'Parrilla', icon: '🥩', dish_count: 8 },
    { id: 'cat-3', name: 'Pastas', icon: '🍝', dish_count: 5 },
    { id: 'cat-4', name: 'Pescados', icon: '🐟', dish_count: 4 },
    { id: 'cat-5', name: 'Guarniciones', icon: '🥔', dish_count: 6 },
    { id: 'cat-6', name: 'Postres', icon: '🍰', dish_count: 5 },
    { id: 'cat-7', name: 'Bebidas', icon: '🍷', dish_count: 10 },
  ];

  private mockDishes: Dish[] = [
    {
      id: 'dish-1',
      name: 'Provoleta',
      description: 'Queso provolone a la parrilla con orégano y aceite de oliva. Servida con pan casero.',
      price: 3500,
      image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
      category_name: 'Entradas',
      available: true,
      preparation_time: 10,
      allergens: ['lactosa'],
      modifiers: [
        {
          id: 'mod-1',
          name: 'Tamaño',
          options: [
            { name: 'Individual', price_adjustment: 0 },
            { name: 'Para compartir', price_adjustment: 1500 },
          ]
        }
      ]
    },
    {
      id: 'dish-2',
      name: 'Empanadas Criollas',
      description: 'Empanadas caseras de carne cortada a cuchillo, aceitunas y huevo. Pack de 3 unidades.',
      price: 2800,
      image_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800',
      category_name: 'Entradas',
      available: true,
      preparation_time: 15,
      allergens: ['gluten', 'huevo'],
      modifiers: [
        {
          id: 'mod-2',
          name: 'Tipo',
          options: [
            { name: 'Carne', price_adjustment: 0 },
            { name: 'Pollo', price_adjustment: 0 },
            { name: 'Jamón y Queso', price_adjustment: 200 },
            { name: 'Verdura', price_adjustment: 0 },
          ]
        }
      ]
    },
    {
      id: 'dish-3',
      name: 'Bife de Chorizo',
      description: 'Corte premium de 400g, madurado 21 días. Jugoso y con el punto perfecto.',
      price: 12500,
      image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
      category_name: 'Parrilla',
      available: true,
      preparation_time: 25,
      modifiers: [
        {
          id: 'mod-3',
          name: 'Punto de cocción',
          options: [
            { name: 'Jugoso', price_adjustment: 0 },
            { name: 'A punto', price_adjustment: 0 },
            { name: 'Cocido', price_adjustment: 0 },
          ]
        },
        {
          id: 'mod-4',
          name: 'Guarnición',
          options: [
            { name: 'Papas fritas', price_adjustment: 0 },
            { name: 'Puré', price_adjustment: 0 },
            { name: 'Ensalada mixta', price_adjustment: 0 },
            { name: 'Verduras grilladas', price_adjustment: 500 },
          ]
        }
      ]
    },
    {
      id: 'dish-4',
      name: 'Entraña',
      description: 'Corte clásico argentino de 350g, tierno y sabroso. Ideal para los amantes de la parrilla.',
      price: 10800,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      category_name: 'Parrilla',
      available: true,
      preparation_time: 20,
    },
    {
      id: 'dish-5',
      name: 'Asado de Tira',
      description: 'Costillas de res asadas lentamente, crujientes por fuera y jugosas por dentro.',
      price: 9500,
      image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800',
      category_name: 'Parrilla',
      available: false,
      preparation_time: 40,
    },
    {
      id: 'dish-6',
      name: 'Ñoquis de Papa',
      description: 'Ñoquis caseros con salsa a elección. Preparados artesanalmente cada día.',
      price: 7200,
      image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',
      category_name: 'Pastas',
      available: true,
      preparation_time: 15,
      allergens: ['gluten', 'huevo', 'lactosa'],
      modifiers: [
        {
          id: 'mod-5',
          name: 'Salsa',
          options: [
            { name: 'Bolognesa', price_adjustment: 0 },
            { name: 'Filetto', price_adjustment: 0 },
            { name: 'Cuatro quesos', price_adjustment: 800 },
            { name: 'Pesto', price_adjustment: 600 },
          ]
        }
      ]
    },
    {
      id: 'dish-7',
      name: 'Tiramisú',
      description: 'Postre italiano clásico con mascarpone, café espresso y cacao amargo.',
      price: 4200,
      image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
      category_name: 'Postres',
      available: true,
      preparation_time: 5,
      allergens: ['lactosa', 'huevo', 'gluten'],
    },
    {
      id: 'dish-8',
      name: 'Flan Casero',
      description: 'Flan tradicional con dulce de leche y crema. Receta de la abuela.',
      price: 3200,
      image_url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800',
      category_name: 'Postres',
      available: true,
      preparation_time: 5,
      allergens: ['lactosa', 'huevo'],
    },
  ];

  ngOnInit(): void {
    // Obtener número de mesa del QR
    this.route.queryParams.subscribe(params => {
      if (params['table']) {
        this.tableNumber = parseInt(params['table'], 10);
      }
    });
    
    // Cargar datos (simulado)
    this.loadMenu();
    
    // Cargar carrito del localStorage
    this.loadCart();
  }

  loadMenu(): void {
    // En producción, esto sería una llamada HTTP al backend
    this.categories = this.mockCategories;
    this.dishes = this.mockDishes;
    this.filteredDishes = this.dishes;
    
    // Seleccionar primera categoría por defecto
    if (this.categories.length > 0) {
      this.selectedCategory = this.categories[0].id;
      this.filterByCategory(this.categories[0]);
    }
  }

  filterByCategory(category: Category): void {
    this.selectedCategory = category.id;
    this.filteredDishes = this.dishes.filter(
      dish => dish.category_name === category.name
    );
  }

  openDishModal(dish: Dish): void {
    this.selectedDish = dish;
    this.isModalOpen = true;
  }

  closeDishModal(): void {
    this.isModalOpen = false;
    this.selectedDish = undefined;
  }

  addToCart(item: CartItem): void {
    // Verificar si ya existe el plato
    const existingIndex = this.cart.items.findIndex(
      i => i.dish.id === item.dish.id && 
           JSON.stringify(i.selectedModifiers) === JSON.stringify(item.selectedModifiers)
    );

    if (existingIndex >= 0) {
      // Actualizar cantidad
      this.cart.items[existingIndex].quantity += item.quantity;
      this.cart.items[existingIndex].totalPrice += item.totalPrice;
    } else {
      // Agregar nuevo
      this.cart.items.push(item);
    }

    this.updateCartTotals();
    this.saveCart();
    
    // Mostrar feedback
    this.showAddedToast(item);
  }

  quickAddToCart(dish: Dish): void {
    const item: CartItem = {
      dish,
      quantity: 1,
      selectedModifiers: [],
      notes: '',
      totalPrice: dish.price,
    };
    this.addToCart(item);
  }

  removeFromCart(index: number): void {
    this.cart.items.splice(index, 1);
    this.updateCartTotals();
    this.saveCart();
  }

  updateCartTotals(): void {
    this.cart.totalItems = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cart.totalPrice = this.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  saveCart(): void {
    localStorage.setItem('gastrogo_cart', JSON.stringify(this.cart));
  }

  loadCart(): void {
    const saved = localStorage.getItem('gastrogo_cart');
    if (saved) {
      this.cart = JSON.parse(saved);
    }
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  }

  private showAddedToast(item: CartItem): void {
    // Implementar toast notification
    console.log(`✅ Agregado: ${item.quantity}x ${item.dish.name}`);
  }

  confirmOrder(): void {
    if (this.cart.items.length === 0) return;
    
    // En producción, enviar pedido al backend
    console.log('Enviando pedido:', {
      tableNumber: this.tableNumber,
      items: this.cart.items,
      total: this.cart.totalPrice,
    });
    
    alert(`¡Pedido confirmado! Mesa ${this.tableNumber}\nTotal: ${this.formatPrice(this.cart.totalPrice)}`);
    
    // Limpiar carrito
    this.cart = { items: [], totalItems: 0, totalPrice: 0 };
    this.saveCart();
    this.isCartOpen = false;
  }
}
