import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import * as constants from "./constant.js";
const BCRYPT_ROUNDS = 10;

export function comparePassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, match) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(match);
    });
  });
}

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, BCRYPT_ROUNDS, (err, hash) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(hash);
    });
  });
}

export async function encrypt(pliantext) {
  // Encrypt
  return await CryptoJS.AES.encrypt(
    pliantext,
    constants.SECRET_KEY_FOR_COLD_STORAGE
  );
}

export async function decrypt(ciphertext) {
  // Decrypt
  var bytes = await CryptoJS.AES.decrypt(
    ciphertext.toString(),
    constants.SECRET_KEY_FOR_COLD_STORAGE
  );
  return await bytes.toString(CryptoJS.enc.Utf8);
}
