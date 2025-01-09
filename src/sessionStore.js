/**
 * Abstract class representing a session store.
 * Implementations should provide methods to manage user sessions.
 * @abstract
 */
class SessionStore {
    /**
     * Retrieve the session data for a given userId.
     * @param {string} userId - The unique identifier for the user.
     * @returns {object|null} The session object associated with the userId, or null if no session exists.
     * @throws {Error} This method must be implemented by subclasses.
     */
    getSession(userId) {
        throw new Error('Not implemented');
    }

    /**
     * Save or update the session data for a given userId.
     * @param {string} userId - The unique identifier for the user.
     * @param {object} sessionData - The session data to be stored for the user.
     * @throws {Error} This method must be implemented by subclasses.
     */
    setSession(userId, sessionData) {
        throw new Error('Not implemented');
    }

    /**
     * Delete the session data for a given userId.
     * @param {string} userId - The unique identifier for the user.
     * @throws {Error} This method must be implemented by subclasses.
     */
    deleteSession(userId) {
        throw new Error('Not implemented');
    }
}

/**
 * An in-memory session store that uses a Map internally.
 * All data is lost when the process restarts.
 * @extends SessionStore
 */
class MemorySessionStore extends SessionStore {
    constructor() {
        super();
        /**
         * Map to store session data, keyed by userId.
         * @type {Map<string, object>}
         */
        this.sessions = new Map();
    }

    /**
     * Retrieve the session data for a given userId.
     * @param {string} userId - The unique identifier for the user.
     * @returns {object|null} The session object associated with the userId, or null if no session exists.
     */
    getSession(userId) {
        return this.sessions.get(userId) || null;
    }

    /**
     * Save or update the session data for a given userId.
     * @param {string} userId - The unique identifier for the user.
     * @param {object} sessionData - The session data to be stored for the user.
     */
    setSession(userId, sessionData) {
        this.sessions.set(userId, sessionData);
    }

    /**
     * Delete the session data for a given userId.
     * @param {string} userId - The unique identifier for the user.
     */
    deleteSession(userId) {
        this.sessions.delete(userId);
    }
}


module.exports = {
    SessionStore,
    MemorySessionStore,
};
