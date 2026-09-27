export default {
  world: 3,
  theme: "forest",
  title: "MOONLIT FOREST",
  boss: "shooter",
  stages: [
    {
      name: "FIREFLY TRAIL",
      seed: 307,
      mode: "ground",
      features: ["hidden", "moving"],
    },
    {
      name: "HOLLOW ROOTS",
      seed: 323,
      mode: "cave",
      features: ["breakable", "portal"],
    },
    {
      name: "CANOPY CROSSING",
      seed: 339,
      mode: "high",
      features: ["moving", "falling"],
    },
    {
      name: "NIGHTGEAR FORTRESS",
      seed: 355,
      mode: "fortress",
      features: ["turrets", "conveyor"],
    },
  ],
};
