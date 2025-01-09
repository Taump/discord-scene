/**
 * Represents a scene with lifecycle callbacks for entering, leaving, and handling messages.
 */
declare class Scene {
    /**
     * Represents a scene with lifecycle callbacks for entering, leaving, and handling messages.
     */
    constructor(name: string);

    /**
     * The name of the scene.
     */
    name: string;

    /**
     * Object containing arrays of callbacks for 'enter', 'leave', and 'message' events.
     */
    callbacks: Object;

    /**
     * Registers a callback to be called when the user enters this scene.
     * @param fn - The callback function to execute upon entering.
     * @returns The current Scene instance.
     */
    onEnter(fn: Function): Scene;

    /**
     * Registers a callback to be called when the user leaves this scene.
     * @param fn - The callback function to execute upon leaving.
     * @returns The current Scene instance.
     */
    onLeave(fn: Function): Scene;

    /**
     * Registers a callback to be called when the user sends a message in this scene.
     * @param fn - The callback function to execute upon receiving a message.
     * @returns The current Scene instance.
     */
    onMessage(fn: Function): Scene;

    /**
     * Triggers all "enter" callbacks for this scene.
     * @param ctx - The context object passed to each callback.
     * @returns A promise that resolves when all callbacks have been executed.
     */
    enter(ctx: object): Promise<void>;

    /**
     * Triggers all "leave" callbacks for this scene.
     * @param ctx - The context object passed to each callback.
     * @returns A promise that resolves when all callbacks have been executed.
     */
    leave(ctx: object): Promise<void>;

    /**
     * Triggers all "message" callbacks for this scene.
     * @param ctx - The context object passed to each callback.
     * @returns A promise that resolves when all callbacks have been executed.
     */
    handleMessage(ctx: object): Promise<void>;

}

/**
 * Abstract class representing a session store.
 * Implementations should provide methods to manage user sessions.
 */
declare abstract class SessionStore {
    /**
     * Abstract class representing a session store. Implementations should provide methods to manage user sessions.
     */
    constructor();

    /**
     * Retrieve the session data for a given userId.
     * @param userId - The unique identifier for the user.
     * @returns The session object associated with the userId, or null if no session exists.
     * @throws This method must be implemented by subclasses.
     */
    getSession(userId: string): object | null;

    /**
     * Save or update the session data for a given userId.
     * @param userId - The unique identifier for the user.
     * @param sessionData - The session data to be stored for the user.
     * @throws This method must be implemented by subclasses.
     */
    setSession(userId: string, sessionData: object): void;

    /**
     * Delete the session data for a given userId.
     * @param userId - The unique identifier for the user.
     * @throws This method must be implemented by subclasses.
     */
    deleteSession(userId: string): void;

}

/**
 * An in-memory session store that uses a Map internally.
 * All data is lost when the process restarts.
 */
declare class MemorySessionStore extends SessionStore {
    /**
     * An in-memory session store that uses a Map internally. All data is lost when the process restarts.
     */
    constructor();

    /**
     * Map to store session data, keyed by userId.
     */
    sessions: Map<string, object>;

    /**
     * Retrieve the session data for a given userId.
     * @param userId - The unique identifier for the user.
     * @returns The session object associated with the userId, or null if no session exists.
     */
    getSession(userId: string): object | null;

    /**
     * Save or update the session data for a given userId.
     * @param userId - The unique identifier for the user.
     * @param sessionData - The session data to be stored for the user.
     */
    setSession(userId: string, sessionData: object): void;

    /**
     * Delete the session data for a given userId.
     * @param userId - The unique identifier for the user.
     */
    deleteSession(userId: string): void;

}

declare class Stage {
    /**
     * 
     * @param sessionStore A storage mechanism for user sessions.
     */
    constructor(sessionStore: SessionStore);

    /**
     * Register multiple scenes in the Stage.
     * @param scenes
     */
    register(...scenes: any): void;

    /**
     * Enter a scene (sceneName) or leave all scenes if sceneName is null.
     * @param sceneName
     * @param ctx
     */
    enter(sceneName: string | null, ctx: object): void;

    /**
     * Handle a new incoming message: check if the user is in a scene, call that scene's onMessage.
     * @param ctx
     */
    handleMessage(ctx: object): void;

}

