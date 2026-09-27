export default {
  world: 4,
  theme: "coral",
  title: "CORAL DEPTHS",
  boss: "swimmer",
  stages: [
    {
      name: "TIDAL SHORE",
      seed: 401,
      mode: "ground",
      features: ["moving", "portal"],
    },
    {
      name: "CORAL CIRCUIT",
      seed: 417,
      mode: "water",
      features: ["water", "hidden"],
    },
    {
      name: "FLOODED RUINS",
      seed: 433,
      mode: "water",
      features: ["water", "turrets"],
    },
    {
      name: "PRESSURE VAULT",
      seed: 449,
      mode: "fortress",
      features: ["water", "conveyor"],
    },
  ],
};
