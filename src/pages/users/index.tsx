import { GetStaticProps } from "next";
import Link from "next/link";

import { Usuario } from "../../interfaces";
import { sampleUserData } from "../../utils/sample-data";
import Layout from "../../../components/Layout";
import List from "../../features/shared/components/List";

type Props = {
  items: Partial<Usuario>[];
};

const WithStaticProps = ({ items }: Props) => (
  <Layout title="Lista de Usuarios | Bloop">
    <h1>Lista de Usuarios</h1>
    <p>
      Ejemplo de obtención de datos desde <code>getStaticProps()</code>.
    </p>
    <p>Estás actualmente en: /users</p>
    <List items={items as any} />
    <p>
      <Link href="/">Ir al inicio</Link>
    </p>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: Partial<Usuario>[] = sampleUserData;
  return { props: { items } };
};

export default WithStaticProps; 