const sha256 = require('crypto-js/sha256');
// data
// 之前区块的hash值
// 自己的hash值，由存储在区块里的信息算出来的（data+之前区块的hash值）
class Block{
    constructor(data,previousHash){
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return sha256(this.previousHash +this.data).toString();
    }
}