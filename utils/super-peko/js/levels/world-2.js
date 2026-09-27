export default {
  world: 2,
  theme: "desert",
  title: "AMBER DESERT",
  boss: "jumper",
  stages: [
    {
      name: "DUNE DASH",
      seed: 211,
      mode: "ground",
      features: ["falling", "hidden"],
    },
    {
      name: "SANDSTONE TUNNELS",
      seed: 227,
      mode: "cave",
      features: ["breakable", "portal"],
    },
    {
      name: "SUNSET LIFTWORKS",
      seed: 243,
      mode: "high",
      features: ["moving", "turrets"],
    },
    {
      name: "SCORCHING FOUNDRY",
      seed: 259,
      mode: "fortress",
      features: ["lava", "conveyor"],
    },
  ],
};
