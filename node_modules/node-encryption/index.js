const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';


/**
 * This function will encrypt the data provided with the aes-256-gcm algorithm.
 *
 * @param {string|Buffer} data      - The data to be encrypted
 * @param {string} encryptionKey    - The encryption key you provide
 */
function encrypt(data, encryptionKey) {
    const iv = crypto.randomBytes(16);

    const salt = crypto.randomBytes(64);

    const MASTER_KEY = crypto
        .createHash('sha256')
        .update(encryptionKey)
        .digest('hex');

    const key = crypto.pbkdf2Sync(MASTER_KEY, salt, 2145, 32, 'sha512');

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
}

/**
 * This function will decrypt the encrypted data 
 * 
 * @param {string|Buffer} data      - The encrypted data to be decrypted
 * @param {string} encryptionKey    - The encryption key you provide for the encryption
 */
function decrypt(encryptedData, encryptionKey) {
    const data = Buffer.from(encryptedData, 'hex');

    const MASTER_KEY = crypto
        .createHash('sha256')
        .update(encryptionKey)
        .digest('hex');

    const salt = data.slice(0, 64);
    const iv = data.slice(64, 80);
    const tag = data.slice(80, 96);
    const text = data.slice(96);

    const key = crypto.pbkdf2Sync(MASTER_KEY, salt, 2145, 32, 'sha512');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(Buffer.from(text, 'hex')), decipher.final()]);

    return decrypted;
}

module.exports = {
    encrypt,
    decrypt,
};