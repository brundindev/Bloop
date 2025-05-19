import React, { ReactNode } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import styled from "styled-components";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BarraLateral from "./BarraLateral";

// Define nuestra interfaz de tema personalizada (igual que en _app.tsx)
interface Theme {
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  hover: string;
  shadow: string;
}

// Estilos para el layout
const Container = styled.div<{ theme: Theme }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const MainContent = styled.main<{ theme: Theme }>`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  border-left: 1px solid ${props => props.theme.border};
  border-right: 1px solid ${props => props.theme.border};
`;

const ContentWrapper = styled(motion.div)`
  padding: 20px;
`;

type Props = {
  children: ReactNode;
  titulo?: string;
  descripcion?: string;
};

const Layout = ({ children, titulo = "Bloop", descripcion = "Una red social moderna e intuitiva" }: Props) => {
  return (
    <Container>
      <Head>
        <title>{titulo} | Bloop</title>
        <meta name="description" content={descripcion} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Barra lateral izquierda (navegación principal) */}
      <Sidebar />

      {/* Contenido principal */}
      <MainContent>
        <Navbar titulo={titulo} />
        <ContentWrapper 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </ContentWrapper>
      </MainContent>

      {/* Barra lateral derecha (tendencias, sugerencias, etc.) */}
      <BarraLateral />
    </Container>
  );
};

export default Layout;
