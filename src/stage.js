class Stage {
    /**
     * @param {SessionStore} sessionStore A storage mechanism for user sessions.
     */
    constructor(sessionStore) {
      this.scenes = new Map();
      this.sessionStore = sessionStore;
    }
  
    /**
     * Register multiple scenes in the Stage.
     * @param  {...any} scenes
     */
    register(...scenes) {
      scenes.forEach((scene) => {
        this.scenes.set(scene.name, scene);
      });
    }
  
    /**
     * Enter a scene (sceneName) or leave all scenes if sceneName is null.
     * @param {string|null} sceneName
     * @param {object} ctx
     */
    async enter(sceneName, ctx) {
      const userId = ctx.userId;
      const currentSession = this.sessionStore.getSession(userId) || {};
  
      // If the user is already in a scene, call its leave callbacks first.
      const prevSceneName = currentSession.currentScene;
      if (prevSceneName) {
        const prevScene = this.scenes.get(prevSceneName);
        if (prevScene) {
          await prevScene.leave(ctx);
        }
      }
  
      // If sceneName is null, we are leaving any active scene completely.
      if (!sceneName) {
        this.sessionStore.deleteSession(userId);
        return;
      }
  
      // Update session: set the new scene
      currentSession.currentScene = sceneName;
      // Initialize data if it doesn't exist
      currentSession.data = currentSession.data || {};
  
      // Save back to sessionStore
      this.sessionStore.setSession(userId, currentSession);
  
      // Trigger onEnter for the new scene
      const newScene = this.scenes.get(sceneName);
      if (!newScene) {
        throw new Error(`Scene "${sceneName}" not found!`);
      }
      await newScene.enter(ctx);
    }
  
    /**
     * Handle a new incoming message:
     * check if the user is in a scene, call that scene's onMessage.
     * @param {object} ctx
     */
    async handleMessage(ctx) {
      const userId = ctx.userId;
      const currentSession = this.sessionStore.getSession(userId);
  
      if (!currentSession) {
        // User is not in any scene
        return;
      }
  
      const sceneName = currentSession.currentScene;
      if (!sceneName) {
        // Session exists but no scene is set
        return;
      }
  
      const scene = this.scenes.get(sceneName);
      if (!scene) return;
  
      // Attach session data to ctx for convenience
      ctx.sessionData = currentSession.data;
  
      // Handle the message in the current scene
      await scene.handleMessage(ctx);
  
      // If the scene updated ctx.sessionData, store it back
      currentSession.data = ctx.sessionData;
      this.sessionStore.setSession(userId, currentSession);
    }
  }
  
  module.exports = Stage;
  