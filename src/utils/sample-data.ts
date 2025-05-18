import { Usuario } from "../interfaces";

/** Datos de usuario de ejemplo. */
export const sampleUserData: Partial<Usuario>[] = [
  { 
    id: "101", 
    nombre: "Alice",
    nombreUsuario: "@alice",
    email: "alice@example.com",
    fotoURL: "/imagenes/usuario-default.png",
    rol: "usuario",
    seguidores: [],
    siguiendo: [],
    favoritos: [],
    publicacionesCount: 0
  },
  { 
    id: "102", 
    nombre: "Bob",
    nombreUsuario: "@bob",
    email: "bob@example.com",
    fotoURL: "/imagenes/usuario-default.png",
    rol: "usuario",
    seguidores: [],
    siguiendo: [],
    favoritos: [],
    publicacionesCount: 0
  },
]; 