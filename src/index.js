const Stage = require('./stage');
const Scene = require('./scene');
const { MemorySessionStore } = require('./sessionStore');

/**
 * The main export of the discord-scene module.
 * Provides classes for managing stages, scenes, and session storage.
 * @type {{Stage: Stage, Scene: Scene, MemorySessionStore: MemorySessionStore}}
 */
const discordScene = {
  Stage,
  Scene,
  MemorySessionStore,
};

module.exports = discordScene;