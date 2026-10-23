// Lista de logros. Edita, agrega o quita entradas libremente.
// Campos:
//   id          - identificador único
//   title       - nombre del logro
//   description - texto descriptivo
//   gamerscore  - puntos (G) que otorga
//   icon        - emoji o símbolo mostrado
//   rarity      - "comun" | "rara" | "epica" | "legendaria"
//   unlocked    - true si está desbloqueado
//   date        - fecha de desbloqueo (texto libre), o "" si está bloqueado
const ACHIEVEMENTS = [
  {
    id: 1,
    title: "Primeros Pasos",
    description: "Completa el tutorial inicial del juego.",
    gamerscore: 10,
    icon: "👣",
    rarity: "comun",
    unlocked: true,
    date: "12 ene 2026",
  },
  {
    id: 2,
    title: "Coleccionista",
    description: "Reúne 50 objetos distintos en tu inventario.",
    gamerscore: 25,
    icon: "🎒",
    rarity: "comun",
    unlocked: true,
    date: "18 ene 2026",
  },
  {
    id: 3,
    title: "Maestro del Combate",
    description: "Derrota a 100 enemigos sin recibir daño crítico.",
    gamerscore: 50,
    icon: "⚔️",
    rarity: "rara",
    unlocked: true,
    date: "02 feb 2026",
  },
  {
    id: 4,
    title: "Explorador Incansable",
    description: "Descubre todas las zonas del mapa.",
    gamerscore: 75,
    icon: "🗺️",
    rarity: "rara",
    unlocked: false,
    date: "",
  },
  {
    id: 5,
    title: "Velocista",
    description: "Termina un nivel en menos de 2 minutos.",
    gamerscore: 40,
    icon: "⚡",
    rarity: "epica",
    unlocked: false,
    date: "",
  },
  {
    id: 6,
    title: "Invencible",
    description: "Completa el juego en dificultad máxima sin morir.",
    gamerscore: 100,
    icon: "🛡️",
    rarity: "legendaria",
    unlocked: false,
    date: "",
  },
  {
    id: 7,
    title: "Amigo de Todos",
    description: "Completa todas las misiones secundarias de aliados.",
    gamerscore: 30,
    icon: "🤝",
    rarity: "rara",
    unlocked: true,
    date: "09 feb 2026",
  },
  {
    id: 8,
    title: "Leyenda Viviente",
    description: "Alcanza el nivel máximo del personaje.",
    gamerscore: 100,
    icon: "👑",
    rarity: "legendaria",
    unlocked: false,
    date: "",
  },
];
