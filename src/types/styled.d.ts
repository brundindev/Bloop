import 'styled-components';

// Extender la interfaz DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme {
    // Propiedades de nuestro tema
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
    hover: string;
    shadow: string;
    
    // Propiedades requeridas por styled-components (aunque no las usemos)
    colors: {
      primary: string;
      secondary: string;
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
