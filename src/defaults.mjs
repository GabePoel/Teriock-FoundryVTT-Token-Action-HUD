import { GROUPS, TOP_GROUPS } from "./constants.mjs";

export let DEFAULTS = null;

/**
 * @param group
 */
function nestGroups(group) {
  group.nestId ??= group.id;
  group.name = _loc(group.name);
  if (group.groups) {
    group.groups = group.groups.map((g) => {
      return { ...nestGroups(g), nestId: `${group.nestId}_${g.id}` };
    });
  }
  return group;
}

Hooks.once("tokenActionHudCoreApiReady", () => {
  DEFAULTS = nestGroups({
    groups: Object.values(GROUPS),
    layout: [
      nestGroups({
        ...TOP_GROUPS.abilities,
        groups: [
          GROUPS.actorAbilitiesActive,
          GROUPS.actorAbilitiesReactive,
          GROUPS.actorAbilitiesSlow,
          GROUPS.actorAbilitiesPassive,
        ],
      }),
      nestGroups({
        ...TOP_GROUPS.basicAbilities,
        groups: [
          GROUPS.basicAbilitiesActive,
          GROUPS.basicAbilitiesReactive,
          GROUPS.basicAbilitiesSlow,
          GROUPS.basicAbilitiesPassive,
        ],
      }),
      nestGroups({ ...TOP_GROUPS.armaments, groups: [GROUPS.equipmentEquipped, GROUPS.bodyParts] }),
      nestGroups({ ...TOP_GROUPS.saves, groups: [GROUPS.attributes, GROUPS.protections] }),
      nestGroups({
        ...TOP_GROUPS.tradecrafts,
        groups: [
          GROUPS.tradecraftsArtisan,
          GROUPS.tradecraftsMediator,
          GROUPS.tradecraftsScholar,
          GROUPS.tradecraftsSurvivalist,
          GROUPS.tradecraftsPrestige,
        ],
      }),
      nestGroups({
        ...TOP_GROUPS.consumables,
        groups: [GROUPS.resources, GROUPS.consumableAbilities, GROUPS.consumableProperties, GROUPS.consumableEquipment],
      }),
      nestGroups({ ...TOP_GROUPS.tools, groups: [GROUPS.utilities] }),
    ],
  });
});
