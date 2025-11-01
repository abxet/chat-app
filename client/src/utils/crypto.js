// src/utils/crypto.js
// Uses tweetnacl for box encrypt/decrypt and Web Crypto for password-based encryption
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import naclUtil from "tweetnacl-util";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// --------------------- tweetnacl helpers (unchanged semantics) ---------------------
export function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    secretKey: util.encodeBase64(keyPair.secretKey),
  };
}

// Convert helpers
export const encodeBase64 = naclUtil.encodeBase64;
export const decodeBase64 = naclUtil.decodeBase64;

// Encrypt message
export const encryptMessage = (message, recipientPublicKeyBase64, senderSecretKeyBase64) => {
  const recipientPublicKey = decodeBase64(recipientPublicKeyBase64);
  const senderSecretKey = decodeBase64(senderSecretKeyBase64);

  if (recipientPublicKey.length !== 32) throw new Error("Bad recipient public key size");
  if (senderSecretKey.length !== 32) throw new Error("Bad secret key size");

  const nonce = nacl.randomBytes(24);
  const messageUint8 = naclUtil.decodeUTF8(message);
  const box = nacl.box(messageUint8, nonce, recipientPublicKey, senderSecretKey);

  return {
    ciphertext: encodeBase64(box),
    nonce: encodeBase64(nonce)
  };
};

// Decrypt message
export const decryptMessage = (ciphertextBase64, nonceBase64, senderPublicKeyBase64, recipientSecretKeyBase64) => {
  try {
    const ciphertext = decodeBase64(ciphertextBase64);
    const nonce = decodeBase64(nonceBase64);
    const senderPublicKey = decodeBase64(senderPublicKeyBase64);
    const recipientSecretKey = decodeBase64(recipientSecretKeyBase64);

    const message = nacl.box.open(ciphertext, nonce, senderPublicKey, recipientSecretKey);
    if (!message) return null;

    return naclUtil.encodeUTF8(message);
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
};


// --------------------- Password-protect long-term private key ---------------------
// We encrypt the *private key string* with an AES-GCM key derived from password via PBKDF2.
// The stored blob is a base64-encoded JSON: { ciphertext: [...], iv: [...], salt: [...] }

const PBKDF2_ITERATIONS = 200000; // tune for UX/CPU (200k)
const SALT_BYTES = 16;
const IV_BYTES = 12;

function arrayToBase64(arr) {
  // arr is Uint8Array or Array
  return btoa(String.fromCharCode(...new Uint8Array(arr)));
}
function base64ToUint8Array(b64) {
  const bin = atob(b64);
  const len = bin.length;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Encrypt the user's secretKey (base64 string) with password; return a base64 JSON blob
export async function encryptPrivateKey(secretKeyBase64, password) {
  // secretKeyBase64: the base64 secret key from tweetnacl
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));

  const passKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  const plaintext = encoder.encode(secretKeyBase64);
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    aesKey,
    plaintext
  );

  const payload = {
    ciphertext: Array.from(new Uint8Array(ciphertextBuffer)),
    iv: Array.from(iv),
    salt: Array.from(salt),
    kdf: { name: "PBKDF2", iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
  };

  const json = JSON.stringify(payload);
  return btoa(json); // base64-encoded JSON string for safe transport/storage
}

// Decrypt the stored blob produced above with password, returning the secretKey base64 string
export async function decryptPrivateKey(encryptedBlobBase64, password) {
  try {
    const json = atob(encryptedBlobBase64);
    const parsed = JSON.parse(json);
    const { ciphertext, iv, salt } = parsed;

    const passKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const aesKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(salt),
        iterations: PBKDF2_ITERATIONS,
        hash: "SHA-256",
      },
      passKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    const plainBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv), tagLength: 128 },
      aesKey,
      new Uint8Array(ciphertext)
    );

    return decoder.decode(plainBuffer); // returns secretKey base64 string
  } catch (err) {
    console.error("decryptPrivateKey failed:", err);
    throw new Error("Failed to decrypt private key — wrong password or corrupted data.");
  }
}
