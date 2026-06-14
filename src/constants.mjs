export const MODULE = { ID: "token-action-hud-teriock" };

export const REQUIRED_CORE_MODULE_VERSION = "2";

export const TOP_GROUPS = {
  abilities: { id: "abilities", name: "TERIOCK_TAH.ABILITIES.LABEL" },
  armaments: { id: "armaments", name: "TERIOCK_TAH.ARMAMENTS.LABEL" },
  basicAbilities: { id: "basic-abilities", name: "TERIOCK_TAH.BASIC_ABILITIES.LABEL" },
  consumables: { id: "consumables", name: "TERIOCK_TAH.CONSUMABLES.LABEL" },
  saves: { id: "saves", name: "TERIOCK_TAH.SAVES.LABEL" },
  tradecrafts: { id: "tradecrafts", name: "TERIOCK_TAH.TRADECRAFTS.LABEL" },
};

export const GROUPS = {
  // Actor Abilities
  actorAbilitiesActive: { id: "actor-abilities-active", name: "TERIOCK_TAH.ABILITIES.GROUPS.active", type: "system" },
  actorAbilitiesPassive: {
    id: "actor-abilities-passive",
    name: "TERIOCK_TAH.ABILITIES.GROUPS.passive",
    type: "system",
  },
  actorAbilitiesReactive: {
    id: "actor-abilities-reactive",
    name: "TERIOCK_TAH.ABILITIES.GROUPS.reactive",
    type: "system",
  },
  actorAbilitiesSlow: { id: "actor-abilities-slow", name: "TERIOCK_TAH.ABILITIES.GROUPS.slow", type: "system" },

  // Basic Abilities
  basicAbilitiesActive: {
    id: "basic-abilities-active",
    name: "TERIOCK_TAH.BASIC_ABILITIES.GROUPS.active",
    type: "system",
  },
  basicAbilitiesPassive: {
    id: "basic-abilities-passive",
    name: "TERIOCK_TAH.BASIC_ABILITIES.GROUPS.passive",
    type: "system",
  },
  basicAbilitiesReactive: {
    id: "basic-abilities-reactive",
    name: "TERIOCK_TAH.BASIC_ABILITIES.GROUPS.reactive",
    type: "system",
  },
  basicAbilitiesSlow: { id: "basic-abilities-slow", name: "TERIOCK_TAH.BASIC_ABILITIES.GROUPS.slow", type: "system" },

  // Armaments
  bodyParts: { id: "body-parts", name: "TERIOCK_TAH.ARMAMENTS.GROUPS.bodyParts", type: "system" },
  equipmentEquipped: { id: "equipment-equipped", name: "TERIOCK_TAH.ARMAMENTS.GROUPS.equipped", type: "system" },
  equipmentUnequipped: { id: "equipment-unequipped", name: "TERIOCK_TAH.ARMAMENTS.GROUPS.unequipped", type: "system" },

  // Tradecrafts
  fluencies: { id: "fluencies", name: "TERIOCK_TAH.TRADECRAFTS.GROUPS.fluencies", type: "system" },
  tradecraftsArtisan: { id: "artisan", name: "TERIOCK_TAH.TRADECRAFTS.GROUPS.artisan", type: "system" },
  tradecraftsMediator: { id: "mediator", name: "TERIOCK_TAH.TRADECRAFTS.GROUPS.mediator", type: "system" },
  tradecraftsPrestige: { id: "prestige", name: "TERIOCK_TAH.TRADECRAFTS.GROUPS.prestige", type: "system" },
  tradecraftsScholar: { id: "scholar", name: "TERIOCK_TAH.TRADECRAFTS.GROUPS.scholar", type: "system" },
  tradecraftsSurvivalist: { id: "survivalist", name: "TERIOCK_TAH.TRADECRAFTS.GROUPS.survivalist", type: "system" },

  // Attributes
  attributes: { id: "attributes", name: "TERIOCK_TAH.SAVES.GROUPS.attributes", type: "system" },

  // Protections
  protections: { id: "protections", name: "TERIOCK_TAH.SAVES.GROUPS.protections", type: "system" },

  // Consumables
  consumableAbilities: { id: "consumable-abilities", name: "TERIOCK_TAH.CONSUMABLES.GROUPS.abilities", type: "system" },
  consumableEquipment: { id: "consumable-equipment", name: "TERIOCK_TAH.CONSUMABLES.GROUPS.equipment", type: "system" },
  consumableProperties: {
    id: "consumable-properties",
    name: "TERIOCK_TAH.CONSUMABLES.GROUPS.properties",
    type: "system",
  },
  resources: { id: "resources", name: "TERIOCK_TAH.CONSUMABLES.GROUPS.resources", type: "system" },

  // Other Documents
  archetypes: { id: "archetypes", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.archetypes", type: "system" },
  conditions: { id: "conditions", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.conditions", type: "system" },
  consequences: { id: "consequences", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.consequences", type: "system" },
  cover: { id: "cover", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.cover", type: "system" },
  hacks: { id: "hacks", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.hacks", type: "system" },
  imbuements: { id: "imbuements", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.imbuements", type: "system" },
  mounts: { id: "mounts", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.mounts", type: "system" },
  powers: { id: "powers", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.powers", type: "system" },
  ranks: { id: "ranks", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.ranks", type: "system" },
  species: { id: "species", name: "TERIOCK_TAH.DOCUMENTS.GROUPS.species", type: "system" },
};
