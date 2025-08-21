const sha256 = require('crypto-js/sha256');
// data
// 之前区块的hash值
// 自己的hash值，由存储在区块里的信息算出来的（data+之前区块的hash值）
class Block{
    constructor(data,previousHash){
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.computeHash();
        this.nonce = 1;
    }
    computeHash(){
        return sha256(this.previousHash +this.data + this.nonce).toString();
    }
    getAnswer(difficulty){
        let answer = "";
        for(let i = 0; i < difficulty; i++){
            answer += "0";
        }
        return answer;
    }
    // 计算符合区块链难度的hash
    // 什么是符合区块链难度的hash
    mine(difficulty){
        while(true){
            this.hash = this.computeHash();
            if(this.hash.substring(0,difficulty) === this.getAnswer(difficulty)){
                console.log("挖矿成功，hash值为："+this.hash);
                break;
            }
            this.nonce++;
        }
    }

}

// 链
// 链是由多个区块组成的
// 链的第一个区块是创世区块
class Chain {
    constructor(){
        this.chain = [this.bigBang()];
        this.difficulty = 5; // 挖矿难度
    }

    bigBang(){
        const genesisBlock = new Block('Genesis Block', '');
        return genesisBlock
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlockToChain(newBlock){
        // 找到最新一个block的hash
        newBlock.previousHash = this.getLatestBlock().hash;
        // 挖矿，计算符合区块链难度的hash
        newBlock.mine(this.difficulty);
        this.chain.push(newBlock);
    }
    // 验证当前的区块链是否合法
    // 验证每个区块的hash值是否正确（是否篡改）
    // 验证每个区块的previousHash是否为previous区块的hash值
    validateChain(){
        if(this.chain.length === 1) {
            if(this.chain[0].hash !== this.chain[0].computeHash()) return false;
            return true; // 只有创世区块时，链是合法的
        }
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 验证当前区块的hash值是否正确
            if(currentBlock.hash !== currentBlock.computeHash()){
                console.log(`区块被篡改:${i}`);
                return false;
            }

            // 验证当前区块的previousHash是否为前一个区块的hash值
            if(currentBlock.previousHash !== previousBlock.hash){
                console.log("前后区块链条断裂")
                return false;
            }
        }
        return true; // 如果所有区块都合法，则链是合法的
    }
}

const chain = new Chain();
const block1 = new Block('转账10元',"");
const block2 = new Block('转账十个10元',"");
chain.addBlockToChain(block1);
chain.addBlockToChain(block2);
chain.chain[1].data = '转账100元'; // 篡改区块
chain.chain[1].mine(5); // 重新计算篡改区块的hash值
// chain.chain[2].previousHash = chain.chain[1].hash; // 让后一个区块的previousHash指向篡改区块的hash值
// console.log(chain);
console.log(chain.validateChain()); // 验证链是否合法

// console.log(sha256("rachel_1").toString().length)
// console.log(sha256("rachel_2").toString())
