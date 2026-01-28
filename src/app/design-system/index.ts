/**
 * GASTROGO - Design System Public API
 * Exportaciones centralizadas de todos los componentes
 */

// Tokens y Variables
export * from './tokens';

// Componentes Atómicos
export { ButtonComponent } from './components/button/button.component';
export type { ButtonVariant, ButtonSize } from './components/button/button.component';

export { InputComponent } from './components/input/input.component';
export type { InputType, InputSize } from './components/input/input.component';

// Componentes de Menú
export { DishCardComponent } from './components/dish-card/dish-card.component';
export type { Dish, DishModifier } from './components/dish-card/dish-card.component';

export { CategoryTabsComponent } from './components/category-tabs/category-tabs.component';
export type { Category } from './components/category-tabs/category-tabs.component';

export { DishModalComponent } from './components/dish-modal/dish-modal.component';
export type { CartItem } from './components/dish-modal/dish-modal.component';

// Componentes KDS (Kitchen Display System)
export { OrderCardComponent } from './components/order-card/order-card.component';
export type { Order, OrderItem, OrderStatus } from './components/order-card/order-card.component';
