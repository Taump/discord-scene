/**
 * Represents a scene with lifecycle callbacks for entering, leaving, and handling messages.
 */
class Scene {
  /**
   * Creates a new Scene instance.
   * @param {string} name - The name of the scene.
   */
  constructor(name) {
    /**
     * The name of the scene.
     * @type {string}
     */
    this.name = name;

    /**
     * Object containing arrays of callbacks for 'enter', 'leave', and 'message' events.
     * @type {{ enter: function[], leave: function[], message: function[] }}
     */
    this.callbacks = {
      enter: [],
      leave: [],
      message: [],
    };
  }

  /**
   * Registers a callback to be called when the user enters this scene.
   * @param {function(object): void} fn - The callback function to execute upon entering.
   * @returns {Scene} The current Scene instance.
   */
  onEnter(fn) {
    this.callbacks.enter.push(fn);
    return this;
  }

  /**
   * Registers a callback to be called when the user leaves this scene.
   * @param {function(object): void} fn - The callback function to execute upon leaving.
   * @returns {Scene} The current Scene instance.
   */
  onLeave(fn) {
    this.callbacks.leave.push(fn);
    return this;
  }

  /**
   * Registers a callback to be called when the user sends a message in this scene.
   * @param {function(object): void} fn - The callback function to execute upon receiving a message.
   * @returns {Scene} The current Scene instance.
   */
  onMessage(fn) {
    this.callbacks.message.push(fn);
    return this;
  }

  /**
   * Triggers all "enter" callbacks for this scene.
   * @param {object} ctx - The context object passed to each callback.
   * @returns {Promise<void>} A promise that resolves when all callbacks have been executed.
   */
  async enter(ctx) {
    for (const cb of this.callbacks.enter) {
      await cb(ctx);
    }
  }

  /**
   * Triggers all "leave" callbacks for this scene.
   * @param {object} ctx - The context object passed to each callback.
   * @returns {Promise<void>} A promise that resolves when all callbacks have been executed.
   */
  async leave(ctx) {
    for (const cb of this.callbacks.leave) {
      await cb(ctx);
    }
  }

  /**
   * Triggers all "message" callbacks for this scene.
   * @param {object} ctx - The context object passed to each callback.
   * @returns {Promise<void>} A promise that resolves when all callbacks have been executed.
   */
  async handleMessage(ctx) {
    for (const cb of this.callbacks.message) {
      await cb(ctx);
    }
  }
}

module.exports = Scene;