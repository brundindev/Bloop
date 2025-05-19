import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
    hover: string;
    shadow: string;
    
    // Propiedades para compatibilidad con las nuevas adiciones en el perfil
    fondo?: string;
    borde?: string;
    texto?: string;
    textoSecundario?: string;
    primario?: string;
    error?: string;
    
    // Propiedades requeridas
    colors: {
      primary: string;
      secondary: string;
      texto?: string;
      textoSecundario?: string;
      fondo?: string;
      borde?: string;
      primario?: string;
      error?: string;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
    };
    fontSizes: {
      small: string;
      medium: string;
      large: string;
    };
  }
} 