import { GROUPS } from "./constants.mjs";

export let ActionHandler = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  /** @extends {ActionHandler} */
  class TeriockActionHandler extends coreModule.api.ActionHandler {
    /**
     * Conditionally add the actions for some array of documents.
     * @param {string[]} groupIds
     * @param {(TeriockActor: actor) => AnyChildDocument[]} documentFn
     * @param {object} group
     * @param {boolean} [anyActor]
     */
    #addActionsFromDocuments(groupIds, documentFn, group, anyActor) {
      if ((anyActor || this.actor) && groupIds.includes(group.id)) {
        this.buildActionsFromDocuments(documentFn(this.actor), group);
      }
    }

    /**
     * Add actions for affinities.
     * @param {string[]} groupIds
     * @param {object} group
     * @param {boolean} [protection=false]
     */
    #addAffinityActions(groupIds, group, protection = false) {
      if (groupIds.includes(group.id)) {
        const actions = Object.entries(TERIOCK.config.affinity.types).filter(([_k, v]) => !protection || v.protection)
          .map(([k, v]) => {
            return { id: k, img: v.img, name: v.label, system: { actionId: k, actionType: "affinity" } };
          });
        this.addActions(actions, { id: group.id });
      }
    }

    /**
     * Add actions for attributes.
     * @param {string[]} groupIds
     * @param {object} group
     */
    #addAttributeActions(groupIds, group) {
      const actions = Object.entries(TERIOCK.config.attribute).map(([k, v]) => {
        return {
          icon: "<i class=\"fas fa-plus\" title=\"Bonus\"></i>",
          id: k,
          img: teriock.helpers.path.getImage("core-rules", v.identifier.split(":")[1]),
          info1: { text: this.actor?.system.attributes[k]?.value.signedString() },
          name: v.label,
          system: { actionId: k, actionType: "attribute" },
        };
      });
      if (groupIds.includes(group.id)) {
        this.addActions(actions, { id: group.id });
      }
    }

    /**
     * Add actions for toggling conditions.
     * @param {string[]} groupIds
     * @param {object} group
     */
    #addConditionToggleActions(groupIds, group) {
      const actions = Object.values(TERIOCK.statuses.conditions).map(v => {
        return {
          cssClass: `toggle ${this.actor?.statuses.has(v.id) ? "active" : ""}`,
          id: `toggle-${v.id}`,
          img: v.img,
          name: v.name,
          selected: this.actor?.statuses.has(v.id),
          system: { actionId: v.id, actionType: "toggleCondition" },
        };
      });
      if (groupIds.includes(group.id)) {
        this.addActions(actions, { id: group.id });
      }
    }

    /**
     * Add actions for hacks.
     * @param {string[]} groupIds
     * @param {object} group
     */
    #addTakeHackActions(groupIds, group) {
      const actions = Object.entries(TERIOCK.config.hack).map(([k, v]) => {
        return {
          cssClass: `toggle ${this.actor?.system.hacks[k]?.value > 0 ? "active" : ""}`,
          id: `hack-${k}`,
          img: TERIOCK.statuses.hacks[v.statuses[0]]?.img,
          info1: { text: this.actor?.system.hacks[k]?.value },
          name: v.label,
          system: { actionId: k, actionType: "takeHack" },
        };
      });
      if (groupIds.includes(group.id)) {
        this.addActions(actions, { id: group.id });
      }
    }

    /**
     * Add actions for unhacks.
     * @param {string[]} groupIds
     * @param {object} group
     */
    #addTakeUnhackActions(groupIds, group) {
      const actions = Object.entries(TERIOCK.config.hack).map(([k, v]) => {
        return {
          cssClass: `toggle ${this.actor?.system.hacks[k]?.value > 0 ? "active" : ""}`,
          id: `unhack-${k}`,
          img: TERIOCK.statuses.hacks[v.statuses[0]]?.img,
          info1: { text: this.actor?.system.hacks[k]?.value },
          name: v.remove,
          system: { actionId: k, actionType: "takeUnhack" },
        };
      });
      if (groupIds.includes(group.id)) {
        this.addActions(actions, { id: group.id });
      }
    }

    /**
     * Add actions for tradecrafts.
     * @param {string[]} groupIds
     * @param {string} field
     * @param {object} group
     */
    #addTradecraftActions(groupIds, field, group) {
      const tradecrafts = Object.entries(TERIOCK.config.tradecraft.tradecrafts).filter(([_k, v]) => v.field === field);
      const actions = tradecrafts.map(([k, v]) => {
        return {
          id: k,
          img: teriock.helpers.path.getImage("tradecrafts", k),
          info1: { text: this.actor?.system.tradecrafts[k]?.value.signedString() },
          name: v.label,
          system: { actionId: k, actionType: "tradecraft" },
        };
      });
      if (groupIds.includes(group.id)) {
        this.addActions(actions, { id: group.id });
      }
    }

    /**
     * Add actions for utilities.
     * @param {string[]} groupIds
     * @param {object} group
     */
    #addUtilityActions(groupIds, group) {
      const commands = [
        { command: "heal", identifier: "healing" },
        { command: "revitalize", identifier: "revitalizing" },
        { command: "awaken", identifier: "awaken", key: "keywords" },
        { command: "bag", identifier: "death-bag" },
        { command: "cover", identifier: "full-cover", key: "cover" },
        { command: "uncover", identifier: "half-cover", key: "cover" },
        { command: "shortRest", identifier: "short-rest" },
        { command: "longRest", identifier: "long-rest" },
      ];
      const actions = commands.map((c) => {
        const ActivationCls = Object.values(teriock.data.pseudoDocuments.activations).find((a) =>
          a.metadata.type === c.command
        );
        return {
          id: c.command,
          img: teriock.helpers.path.getImage(c.key ?? "core-rules", c.identifier),
          name: _loc(new ActivationCls().label),
          system: { actionId: c.command, actionType: "command" },
        };
      });
      if (groupIds.includes(group.id)) {
        this.addActions(actions, { id: group.id });
      }
    }

    /**
     * Add the action for some array of documents.
     * @param {AnyChildDocument[]} documents
     * @param {object} group
     */
    buildActionsFromDocuments(documents, group) {
      if (!documents.length) { return; }
      const docs = TERIOCK.config.document[documents[0].type]?.sorter?.(documents)?.filter((d) => d.active);
      const actions = docs?.map((d) => {
        const out = {
          id: d.uuid,
          img: d.img,
          name: d.fullName || d.name,
          system: { actionId: d.uuid, actionType: "child" },
        };
        if (d.system.consumable) {
          out.info1 = { text: d.system.remainingString };
        }
        return out;
      });
      if (actions) { this.addActions(actions, { id: group.id }); }
    }

    /** @inheritdoc */
    async buildSystemActions(groupIds) {
      // Non-basic abilities
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.ability.filter((a) => a.system.maneuver === "active"),
        GROUPS.actorAbilitiesActive,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.ability.filter((a) => a.system.maneuver === "reactive"),
        GROUPS.actorAbilitiesReactive,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.ability.filter((a) => a.system.maneuver === "slow"),
        GROUPS.actorAbilitiesSlow,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.ability.filter((a) => a.system.maneuver === "passive"),
        GROUPS.actorAbilitiesPassive,
      );

      // Basic abilities
      this.#addActionsFromDocuments(
        groupIds,
        () => game.teriock.basicAbilities.filter((a) => a.system.maneuver === "active"),
        GROUPS.basicAbilitiesActive,
        true,
      );
      this.#addActionsFromDocuments(
        groupIds,
        () => game.teriock.basicAbilities.filter((a) => a.system.maneuver === "reactive"),
        GROUPS.basicAbilitiesReactive,
        true,
      );
      this.#addActionsFromDocuments(
        groupIds,
        () => game.teriock.basicAbilities.filter((a) => a.system.maneuver === "slow"),
        GROUPS.basicAbilitiesSlow,
        true,
      );
      this.#addActionsFromDocuments(
        groupIds,
        () => game.teriock.basicAbilities.filter((a) => a.system.maneuver === "passive"),
        GROUPS.basicAbilitiesPassive,
        true,
      );

      // Armaments
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.equipment.filter((e) => e.system.equipped),
        GROUPS.equipmentEquipped,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.equipment.filter((e) => !e.system.equipped),
        GROUPS.equipmentUnequipped,
      );
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.body, GROUPS.bodyParts);

      // Tradecrafts
      this.#addTradecraftActions(groupIds, "artisan", GROUPS.tradecraftsArtisan);
      this.#addTradecraftActions(groupIds, "mediator", GROUPS.tradecraftsMediator);
      this.#addTradecraftActions(groupIds, "scholar", GROUPS.tradecraftsScholar);
      this.#addTradecraftActions(groupIds, "survivalist", GROUPS.tradecraftsSurvivalist);
      this.#addTradecraftActions(groupIds, "prestige", GROUPS.tradecraftsPrestige);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.fluency, GROUPS.fluencies);

      // Saves
      this.#addAttributeActions(groupIds, GROUPS.attributes);
      this.#addAffinityActions(groupIds, GROUPS.protections, true);

      // Consumables
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.resource, GROUPS.resources);
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.ability.filter((a) => a.system.consumable),
        GROUPS.consumableAbilities,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.property.filter((p) => p.system.consumable),
        GROUPS.consumableProperties,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.previewedTypes.equipment.filter((e) => e.system.consumable),
        GROUPS.consumableEquipment,
      );

      // Utilities
      this.#addUtilityActions(groupIds, GROUPS.utilities);
      this.#addAffinityActions(groupIds, GROUPS.affinities);
      this.#addTakeHackActions(groupIds, GROUPS.takeHacks);
      this.#addTakeUnhackActions(groupIds, GROUPS.takeUnhacks);
      this.#addConditionToggleActions(groupIds, GROUPS.toggleConditions);

      // Other Documents
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.species, GROUPS.species);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.power, GROUPS.powers);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.rank, GROUPS.ranks);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.archetype, GROUPS.archetypes);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.mount, GROUPS.mounts);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.consequence, GROUPS.consequences);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.condition, GROUPS.conditions);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.imbuement, GROUPS.imbuements);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.hack ?? [], GROUPS.hacks);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.condition, GROUPS.conditions);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.previewedTypes.cover ?? [], GROUPS.cover);
    }
  }

  ActionHandler = TeriockActionHandler;
});
