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
     * Add actions for attributes.
     * @param {string[]} groupIds
     * @param {object} group
     */
    #addAttributeActions(groupIds, group) {
      const actions = Object.entries(TERIOCK.config.attribute).map(([k, v]) => {
        return {
          icon: "<i class=\"fas fa-plus\" title=\"Bonus\"></i>",
          id: k,
          img: tm.path.getImage("core-rules", v.identifier.split(":")[1]),
          info1: { text: this.actor?.system.attributes[k]?.currentValue.signedString() },
          name: v.label,
          system: { actionId: k, actionType: "attribute" },
        };
      });
      if (groupIds.includes(group.id)) {
        this.addActions(actions, { id: group.id });
      }
    }

    /**
     * Add actions for protections.
     * @param {string[]} groupIds
     * @param {object} group
     */
    #addProtectionActions(groupIds, group) {
      const protections = [{
        id: "resistance",
        img: tm.path.getImage("effect-types", "resistance"),
        name: _loc("TERIOCK_TAH.SAVES.PROTECTIONS.resistance"),
      }, {
        id: "hexproof",
        img: tm.path.getImage("effect-types", "hexproof"),
        name: _loc("TERIOCK_TAH.SAVES.PROTECTIONS.hexproof"),
      }, {
        id: "immunity",
        img: tm.path.getImage("effect-types", "immunity"),
        name: _loc("TERIOCK_TAH.SAVES.PROTECTIONS.immunity"),
      }, {
        id: "hexseal",
        img: tm.path.getImage("effect-types", "hexseal"),
        name: _loc("TERIOCK_TAH.SAVES.PROTECTIONS.hexseal"),
      }];
      const actions = protections.map((p) => {
        return { id: p.id, img: p.img, name: p.name, system: { actionId: p.id, actionType: "protection" } };
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
          img: tm.path.getImage("tradecrafts", k),
          info1: { text: this.actor?.system.tradecrafts[k]?.currentValue.signedString() },
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
        const ActivationCls = Object.values(teriock.data.pseudoDocuments.activations).find((a) => a.TYPE === c.command);
        return {
          id: c.command,
          img: tm.path.getImage(c.key ?? "core-rules", c.identifier),
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
      const docs = TERIOCK.config.document[documents[0].type].sorter(documents).filter((d) => d.active);
      const actions = docs.map((d) => {
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
      this.addActions(actions, { id: group.id });
    }

    /** @inheritdoc */
    async buildSystemActions(groupIds) {
      // Non-basic abilities
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.abilities.filter((a) => a.system.maneuver === "active"),
        GROUPS.actorAbilitiesActive,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.abilities.filter((a) => a.system.maneuver === "reactive"),
        GROUPS.actorAbilitiesReactive,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.abilities.filter((a) => a.system.maneuver === "slow"),
        GROUPS.actorAbilitiesSlow,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.abilities.filter((a) => a.system.maneuver === "passive"),
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
        (actor) => actor?.equipment.filter((e) => e.system.equipped),
        GROUPS.equipmentEquipped,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.equipment.filter((e) => !e.system.equipped),
        GROUPS.equipmentUnequipped,
      );
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.bodyParts, GROUPS.bodyParts);

      // Tradecrafts
      this.#addTradecraftActions(groupIds, "artisan", GROUPS.tradecraftsArtisan);
      this.#addTradecraftActions(groupIds, "mediator", GROUPS.tradecraftsMediator);
      this.#addTradecraftActions(groupIds, "scholar", GROUPS.tradecraftsScholar);
      this.#addTradecraftActions(groupIds, "survivalist", GROUPS.tradecraftsSurvivalist);
      this.#addTradecraftActions(groupIds, "prestige", GROUPS.tradecraftsPrestige);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.fluencies, GROUPS.fluencies);

      // Saves
      this.#addAttributeActions(groupIds, GROUPS.attributes);
      this.#addProtectionActions(groupIds, GROUPS.protections);

      // Consumables
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.resources, GROUPS.resources);
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.abilities.filter((a) => a.system.consumable),
        GROUPS.consumableAbilities,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.properties.filter((p) => p.system.consumable),
        GROUPS.consumableProperties,
      );
      this.#addActionsFromDocuments(
        groupIds,
        (actor) => actor?.equipment.filter((e) => e.system.consumable),
        GROUPS.consumableEquipment,
      );

      // Utilities
      this.#addUtilityActions(groupIds, GROUPS.utilities);

      // Other Documents
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.species, GROUPS.species);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.powers, GROUPS.powers);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.ranks, GROUPS.ranks);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.archetypes, GROUPS.archetypes);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.mounts, GROUPS.mounts);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.consequences, GROUPS.consequences);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.conditions, GROUPS.conditions);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.imbuements, GROUPS.imbuements);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.visibleChildrenByType?.hack ?? [], GROUPS.hacks);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.conditions, GROUPS.conditions);
      this.#addActionsFromDocuments(groupIds, (actor) => actor?.visibleChildrenByType?.cover ?? [], GROUPS.cover);
    }
  }

  ActionHandler = TeriockActionHandler;
});
