import 'styled-components';

// Extender la interfaz DefaultTheme
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
  }
}
