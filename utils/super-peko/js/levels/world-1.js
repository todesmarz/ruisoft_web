export default {
  world: 1,
  theme: "meadow",
  title: "SUNLIT MEADOW",
  boss: "charger",
  stages: [
    {
      name: "MEADOW RUN",
      seed: 101,
      mode: "ground",
      features: ["blocks", "hidden"],
    },
    {
      name: "BURIED CIRCUIT",
      seed: 117,
      mode: "cave",
      features: ["breakable", "portal"],
    },
    {
      name: "CLOUDSTEP HILLS",
      seed: 133,
      mode: "high",
      features: ["moving", "falling"],
    },
    {
      name: "COPPER CITADEL",
      seed: 149,
      mode: "fortress",
      features: ["lava", "turrets"],
    },
  ],
};
