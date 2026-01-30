/**
 * QR Code Generation Service
 */

const QRCode = require("qrcode");

/**
 * Generate QR code as data URL
 * @param {string} batchId - The batch ID to encode
 * @param {string} baseUrl - Base URL for verification endpoint
 * @returns {Promise<string>} QR code as data URL
 */
async function generateQRCodeDataUrl(batchId, baseUrl) {
    const verificationUrl = `${baseUrl}/verify/${batchId}`;

    const options = {
        type: "image/png",
        width: 300,
        margin: 2,
        color: {
            dark: "#1a5f2a",  // AyurChain green
            light: "#ffffff",
        },
    };

    try {
        const dataUrl = await QRCode.toDataURL(verificationUrl, options);
        return dataUrl;
    } catch (error) {
        console.error("QR Code generation error:", error);
        throw error;
    }
}

/**
 * Generate QR code as buffer (for file response)
 * @param {string} batchId - The batch ID to encode
 * @param {string} baseUrl - Base URL for verification endpoint
 * @returns {Promise<Buffer>} QR code as buffer
 */
async function generateQRCodeBuffer(batchId, baseUrl) {
    const verificationUrl = `${baseUrl}/verify/${batchId}`;

    const options = {
        type: "png",
        width: 300,
        margin: 2,
        color: {
            dark: "#1a5f2a",
            light: "#ffffff",
        },
    };

    try {
        const buffer = await QRCode.toBuffer(verificationUrl, options);
        return buffer;
    } catch (error) {
        console.error("QR Code generation error:", error);
        throw error;
    }
}

module.exports = {
    generateQRCodeDataUrl,
    generateQRCodeBuffer,
};
