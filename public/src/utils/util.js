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

  static async getEncryptionKey(senderPrivateKey, receiverPublicKey) {
    const sodium = await this.init();
    const encryptionKeyObject = sodium.crypto_kx_client_session_keys(
      sodium.crypto_scalarmult_base(sodium.from_hex(senderPrivateKey)),
      sodium.from_hex(senderPrivateKey),
      sodium.from_hex(receiverPublicKey)
    ).sharedRx;

    return sodium.to_hex(encryptionKeyObject);
  }

  static async getDecryptionKey(receiverPrivateKey, senderPublicKey) {
    const sodium = await this.init();
    const decryptionKeyObject = sodium.crypto_kx_server_session_keys(
      sodium.crypto_scalarmult_base(sodium.from_hex(receiverPrivateKey)),
      sodium.from_hex(receiverPrivateKey),
      sodium.from_hex(senderPublicKey)
    ).sharedTx;
    return sodium.to_hex(decryptionKeyObject);
  }

  static async encryptMessage(message, sharedRx) {
    return CryptoJS.AES.encrypt(message, sharedRx).toString();
  }
}

export default EncryptionService;
