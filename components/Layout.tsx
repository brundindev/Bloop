import React, { ReactNode } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import BarraLateral from "./BarraLateral";
import { useTema } from "../contexts/TemaContext";

type Props = {
  children: ReactNode;
  titulo?: string;
  descripcion?: string;
};

const Layout = ({ children, titulo = "Bloop", descripcion = "Una red social moderna e intuitiva" }: Props) => {
  const { tema } = useTema();

  return (
    <div className={`layout-container ${tema === 'oscuro' ? 'tema-oscuro' : ''}`}>
      <Head>
        <title>{titulo} | Bloop</title>
        <meta name="description" content={descripcion} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Barra lateral izquierda (navegación principal) */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="main-content">
        <Navbar titulo={titulo} />
        <motion.div 
          className="content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Barra lateral derecha (tendencias, sugerencias, etc.) */}
      <BarraLateral />
    </div>
  );
};

export default Layout;
