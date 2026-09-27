export default {
  world: 6,
  theme: "storm",
  title: "STORM FACTORY",
  boss: "storm",
  stages: [
    {
      name: "THUNDER PLAINS",
      seed: 601,
      mode: "ground",
      features: ["turrets", "hidden"],
    },
    {
      name: "ASSEMBLY DEPTHS",
      seed: 617,
      mode: "cave",
      features: ["conveyor", "breakable"],
    },
    {
      name: "TURBINE TOWERS",
      seed: 633,
      mode: "high",
      features: ["moving", "turrets"],
    },
    {
      name: "VOLTAGE KEEP",
      seed: 649,
      mode: "fortress",
      features: ["conveyor", "lava"],
    },
  ],
};
