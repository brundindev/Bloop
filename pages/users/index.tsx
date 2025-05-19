import { GetStaticProps } from "next";
import Link from "next/link";

import { Usuario } from "../../interfaces";
import { sampleUserData } from "../../utils/sample-data";
import Layout from "../../components/Layout";
import List from "../../components/List";

type Props = {
  items: Partial<Usuario>[];
};

const WithStaticProps = ({ items }: Props) => (
  <Layout titulo="Lista de Usuarios | Bloop">
    <h1>Lista de Usuarios</h1>
    <p>
      Ejemplo de obtención de datos desde <code>getStaticProps()</code>.
    </p>
    <p>Estás actualmente en: /users</p>
    <List items={items} />
    <p>
      <Link href="/">Volver al inicio</Link>
    </p>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  // Ejemplo para datos SSG
  const items: Partial<Usuario>[] = sampleUserData;
  return { props: { items } };
};

export default WithStaticProps;
