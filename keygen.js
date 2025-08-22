var EC = require('elliptic').ec;
const sha256 = require('crypto-js/sha256');

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');

// Generate keys
var key = ec.genKeyPair();

console.log(key.getPrivate('hex')); // 私钥
console.log(key.getPublic('hex')); // 公钥

const doc = "转账10元"
const hashDoc = sha256(doc).toString(); // 文档的hash值
const signature = key.sign(hashDoc,"base64").toDER("hex"); // 使用私钥对hash值进行签名

console.log(hashDoc); // 打印文档的hash值
console.log(signature); // 打印签名

// 收到签名的一方
console.log(key.verify(hashDoc, signature));

// 尝试篡改
const doc2 = "转账100元";
const hashDoc2 = sha256(doc2).toString(); // 新文档的hash
console.log(key.verify(hashDoc2, signature))