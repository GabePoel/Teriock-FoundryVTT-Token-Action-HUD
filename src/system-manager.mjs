import { ActionHandler } from "./action-handler.mjs";
import { DEFAULTS } from "./defaults.mjs";
import { RollHandler } from "./roll-handler.mjs";

export let SystemManager = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  /** @extends {SystemManager} */
  class TeriockSystemManager extends coreModule.api.SystemManager {
    /** @inheritdoc */
    getActionHandler() {
      return new ActionHandler();
    }

    /** @inheritdoc */
    getAvailableRollHandlers() {
      return { core: "Teriock" };
    }

    /** @inheritdoc */
    getRollHandler(rollHandlerId) {
      switch (rollHandlerId) {
        case "core":
        default:
          return new RollHandler();
      }
    }

    /** @inheritdoc */
    async registerDefaults() {
      return DEFAULTS;
    }
  }

  SystemManager = TeriockSystemManager;
});
