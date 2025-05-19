import React from "react";
import Link from "next/link";

import { Usuario } from "../interfaces";

type Props = {
  data: Partial<Usuario>;
};

const ListItem = ({ data }: Props) => (
  <Link href="/users/[id]" as={`/users/${data.id}`}>
    {data.id}:{data.nombre}
  </Link>
);

export default ListItem;
