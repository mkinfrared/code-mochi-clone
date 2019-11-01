import { objectType } from "nexus";

export const Hero = objectType({
  name: "Hero",
  definition(t) {
    t.model.heroName();
    t.model.hitpoints();
  }
});
