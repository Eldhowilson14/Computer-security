import _sodium from "libsodium-wrappers";
import CryptoJS from "crypto-js";

class EncryptionService {
  static async init() {
    if (!this.sodium) {
      await _sodium.ready;
      this.sodium = _sodium;
    }
    return this.sodium;
  }

  static async generateKeyPair() {
    const sodium = await this.init();
    const key = sodium.crypto_kx_keypair();
    return {
      publicKey: sodium.to_hex(key.publicKey),
      privateKey: sodium.to_hex(key.privateKey),
    };
  }
}

export default EncryptionService;
