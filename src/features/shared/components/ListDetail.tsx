import * as React from "react";

import { Usuario } from "../../../interfaces";

type ListDetailProps = {
  item: Usuario;
};

const ListDetail = ({ item: usuario }: ListDetailProps) => (
  <div>
    <h1>Detalle para {usuario.nombre}</h1>
    <p>ID: {usuario.id}</p>
  </div>
);

export default ListDetail;
