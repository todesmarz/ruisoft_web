export default {
  world: 5,
  theme: "frost",
  title: "FROSTLINE RIDGE",
  boss: "splitter",
  stages: [
    {
      name: "SNOWDRIFT SPRINT",
      seed: 503,
      mode: "ice",
      features: ["ice", "hidden"],
    },
    {
      name: "FROZEN GROTTO",
      seed: 519,
      mode: "cave",
      features: ["breakable", "falling"],
    },
    {
      name: "ICICLE HEIGHTS",
      seed: 535,
      mode: "ice",
      features: ["moving", "falling"],
    },
    {
      name: "GLACIER ENGINE",
      seed: 551,
      mode: "fortress",
      features: ["ice", "turrets"],
    },
  ],
};
