/**
 * GASTROGO - Design System Tokens
 * Sistema de diseño con variables CSS y constantes
 * Contraste AA para legibilidad en entornos con poca luz
 */

export const tokens = {
  // ═══════════════════════════════════════════════════════════
  // COLORES - Paleta Principal
  // ═══════════════════════════════════════════════════════════
  colors: {
    // Marca
    primary: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800', // Principal
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    
    // Secundario
    secondary: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50', // Principal
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    
    // Estados del pedido
    status: {
      created: '#2196F3',     // Azul
      confirmed: '#9C27B0',   // Púrpura
      preparing: '#FF9800',   // Naranja
      ready: '#4CAF50',       // Verde
      delivered: '#00BCD4',   // Cyan
      paid: '#607D8B',        // Gris
      cancelled: '#F44336',   // Rojo
    },
    
    // Semánticos
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Neutrales (Light Mode)
    light: {
      background: '#FAFAFA',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      border: '#E0E0E0',
      textPrimary: '#212121',    // Contraste 15.8:1 ✓ AAA
      textSecondary: '#757575',  // Contraste 4.6:1 ✓ AA
      textDisabled: '#BDBDBD',
    },
    
    // Neutrales (Dark Mode - para KDS)
    dark: {
      background: '#121212',
      surface: '#1E1E1E',
      surfaceElevated: '#2D2D2D',
      border: '#424242',
      textPrimary: '#FFFFFF',    // Contraste 21:1 ✓ AAA
      textSecondary: '#B0B0B0',  // Contraste 7:1 ✓ AA
      textDisabled: '#6B6B6B',
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // TIPOGRAFÍA
  // ═══════════════════════════════════════════════════════════
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // ═══════════════════════════════════════════════════════════
  // ESPACIADO
  // ═══════════════════════════════════════════════════════════
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
  },
  
  // ═══════════════════════════════════════════════════════════
  // BORDES Y RADIOS
  // ═══════════════════════════════════════════════════════════
  borderRadius: {
    none: '0',
    sm: '0.25rem',  // 4px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.5rem',// 24px
    full: '9999px',
  },
  
  // ═══════════════════════════════════════════════════════════
  // SOMBRAS
  // ═══════════════════════════════════════════════════════════
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    // Sombras para Dark Mode
    darkMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    darkLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  },
  
  // ═══════════════════════════════════════════════════════════
  // TRANSICIONES
  // ═══════════════════════════════════════════════════════════
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
    // Para estados de pedido
    status: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // ═══════════════════════════════════════════════════════════
  // BREAKPOINTS
  // ═══════════════════════════════════════════════════════════
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // ═══════════════════════════════════════════════════════════
  // Z-INDEX
  // ═══════════════════════════════════════════════════════════
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },
};

// CSS Variables para usar en stylesheets
export const cssVariables = `
:root {
  /* Colores primarios */
  --color-primary: ${tokens.colors.primary[500]};
  --color-primary-light: ${tokens.colors.primary[300]};
  --color-primary-dark: ${tokens.colors.primary[700]};
  
  /* Colores secundarios */
  --color-secondary: ${tokens.colors.secondary[500]};
  --color-secondary-light: ${tokens.colors.secondary[300]};
  --color-secondary-dark: ${tokens.colors.secondary[700]};
  
  /* Estados de pedido */
  --color-status-created: ${tokens.colors.status.created};
  --color-status-confirmed: ${tokens.colors.status.confirmed};
  --color-status-preparing: ${tokens.colors.status.preparing};
  --color-status-ready: ${tokens.colors.status.ready};
  --color-status-delivered: ${tokens.colors.status.delivered};
  --color-status-paid: ${tokens.colors.status.paid};
  --color-status-cancelled: ${tokens.colors.status.cancelled};
  
  /* Semánticos */
  --color-success: ${tokens.colors.success};
  --color-warning: ${tokens.colors.warning};
  --color-error: ${tokens.colors.error};
  --color-info: ${tokens.colors.info};
  
  /* Light mode (default) */
  --bg-primary: ${tokens.colors.light.background};
  --bg-surface: ${tokens.colors.light.surface};
  --bg-elevated: ${tokens.colors.light.surfaceElevated};
  --border-color: ${tokens.colors.light.border};
  --text-primary: ${tokens.colors.light.textPrimary};
  --text-secondary: ${tokens.colors.light.textSecondary};
  --text-disabled: ${tokens.colors.light.textDisabled};
  
  /* Tipografía */
  --font-family: ${tokens.typography.fontFamily.primary};
  --font-mono: ${tokens.typography.fontFamily.mono};
  
  /* Espaciado base */
  --spacing-unit: 0.25rem;
  
  /* Radios */
  --radius-sm: ${tokens.borderRadius.sm};
  --radius-md: ${tokens.borderRadius.md};
  --radius-lg: ${tokens.borderRadius.lg};
  --radius-xl: ${tokens.borderRadius.xl};
  
  /* Sombras */
  --shadow-sm: ${tokens.shadows.sm};
  --shadow-md: ${tokens.shadows.md};
  --shadow-lg: ${tokens.shadows.lg};
  
  /* Transiciones */
  --transition-fast: ${tokens.transitions.fast};
  --transition-normal: ${tokens.transitions.normal};
}

/* Dark mode para KDS (Kitchen Display System) */
[data-theme="dark"], .theme-dark {
  --bg-primary: ${tokens.colors.dark.background};
  --bg-surface: ${tokens.colors.dark.surface};
  --bg-elevated: ${tokens.colors.dark.surfaceElevated};
  --border-color: ${tokens.colors.dark.border};
  --text-primary: ${tokens.colors.dark.textPrimary};
  --text-secondary: ${tokens.colors.dark.textSecondary};
  --text-disabled: ${tokens.colors.dark.textDisabled};
  
  --shadow-md: ${tokens.shadows.darkMd};
  --shadow-lg: ${tokens.shadows.darkLg};
}
`;

export default tokens;
