import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark: string;
      primaryLight: string;
      secondary: string;
      background: string;
      backgroundDark: string;
      text: string;
      textDark: string;
      gray100: string;
      gray200: string;
      gray700: string;
      gray800: string;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontSizes: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
      xxlarge: string;
    };
  }
} 