export default {
  world: 8,
  theme: "core",
  title: "OBSIDIAN CORE",
  boss: "overlord",
  stages: [
    {
      name: "ASHEN APPROACH",
      seed: 809,
      mode: "ground",
      features: ["lava", "turrets"],
    },
    {
      name: "MOLTEN LABYRINTH",
      seed: 825,
      mode: "cave",
      features: ["breakable", "portal"],
    },
    {
      name: "FINAL CONVEYOR",
      seed: 841,
      mode: "high",
      features: ["conveyor", "falling"],
    },
    {
      name: "OBSIDIAN NEXUS",
      seed: 857,
      mode: "fortress",
      features: ["lava", "turrets", "moving"],
    },
  ],
};
