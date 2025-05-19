import * as React from "react";
import ListItem from "./ListItem";
import { Usuario } from "../interfaces";

type Props = {
  items: Usuario[];
};

const List = ({ items }: Props) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
);

export default List; 