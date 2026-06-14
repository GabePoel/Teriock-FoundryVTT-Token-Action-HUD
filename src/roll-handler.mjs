export let RollHandler = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  /** @extends {RollHandler} */
  class TeriockRollHandler extends coreModule.api.RollHandler {
    /** @inheritdoc */
    async #handleActionClick(event, actor) {
      const { actionId, actionType } = this.action.system;
      if (actor) {
        switch (actionType) {
          case "child": {
            const document = await fromUuid(actionId);
            if (document) {
              if (event.type === "auxclick") {
                await document.sheet?.render(true);
              } else {
                await document.use({ actor, event });
              }
            }
            break;
          }
          case "tradecraft":
            actor.system.tradecrafts[actionId]?.use({ event });
            break;
          case "attribute":
            actor.system.attributes[actionId]?.use({ event });
            break;
          case "protection":
            switch (actionId) {
              case "resistance":
                actor.system.rollResistance({ event });
                break;
              case "hexproof":
                actor.system.rollResistance({ event, hex: true });
                break;
              case "immunity":
                actor.system.rollImmunity({ event });
                break;
              case "hexseal":
                actor.system.rollImmunity({ event, hex: true });
                break;
              default:
                console.warn(`No protection handler found for action ID "${actionId}"`);
            }
            break;
          default:
            console.warn(`No handler found for action type "${actionType}"`);
        }
      }
    }

    /** @type {TeriockActor[]} */
    get actors() {
      if (this.actor) { return [this.actor]; }
      return game.actors.selected;
    }

    /** @inheritdoc */
    async handleActionClick(event) {
      for (const actor of this.actors) {
        this.#handleActionClick(event, actor);
      }
    }
  }

  RollHandler = TeriockRollHandler;
});
