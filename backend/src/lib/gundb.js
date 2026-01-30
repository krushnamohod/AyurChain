/**
 * GunDB Singleton Module
 * 
 * @intent Manages GunDB lifecycle for decentralized event storage
 * Provides graph-based, real-time sync with cryptographic verification
 */

const Gun = require("gun");
require("gun/sea"); // Security, Encryption, Authorization

let gun = null;
let eventsDb = null;

/**
 * Initialize GunDB
 * @param {Object} server - HTTP server for WebSocket relay (optional)
 * @returns {Object} GunDB instance
 */
function initGunDB(server = null) {
    if (gun) {
        console.log("⚡ [GunDB] Already initialized");
        return gun;
    }

    try {
        const options = {
            peers: [
                // Public GunDB relay peers for sync
                "https://gun-manhattan.herokuapp.com/gun",
                "https://gun-us.herokuapp.com/gun",
            ],
            localStorage: false, // Use memory for server
            radisk: true, // Enable persistent storage
            file: "ayurchain-gun-data", // Data directory
        };

        // If server provided, enable WebSocket relay
        if (server) {
            options.web = server;
        }

        gun = Gun(options);
        eventsDb = gun.get("ayurchain-events");

        console.log("✅ [GunDB] Initialized successfully");
        console.log("📂 [GunDB] Events database ready at 'ayurchain-events'");

        return gun;
    } catch (error) {
        console.error("❌ [GunDB] Initialization failed:", error);
        throw error;
    }
}

/**
 * Get the events database namespace
 * @returns {Object} GunDB events node
 */
function getEventsDb() {
    if (!eventsDb) {
        throw new Error("GunDB not initialized. Call initGunDB() first.");
    }
    return eventsDb;
}

/**
 * Get the main Gun instance
 * @returns {Object} Gun instance
 */
function getGun() {
    return gun;
}

module.exports = {
    initGunDB,
    getEventsDb,
    getGun,
};
