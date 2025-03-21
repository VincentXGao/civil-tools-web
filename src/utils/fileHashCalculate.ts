import CryptoJS from 'crypto-js';
import SHA256 from 'crypto-js/sha256';

export async function calculateHash(file: Blob) {
  const arrayBuffer = await file.arrayBuffer();
  return calculateSHA256(arrayBuffer);
}

function calculateSHA256(arrayBuffer: ArrayBuffer) {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  const hash = SHA256(wordArray).toString(CryptoJS.enc.Hex);
  return hash;
}