import { MODULE, REQUIRED_CORE_MODULE_VERSION } from "./constants.mjs";
import { SystemManager } from "./system-manager.mjs";

Hooks.on("tokenActionHudCoreApiReady", () => {
  const module = game.modules.get(MODULE.ID);
  module.api = { requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION, SystemManager };
  Hooks.call("tokenActionHudSystemReady", module);
});
