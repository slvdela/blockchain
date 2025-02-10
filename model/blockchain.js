var addressUtilities = require('../utils/address');
var arrayUtilities = require('../utils/array');
var validator = require('../utils/validator');

var blockchain = function blockchain(){

  var self = this;

  this.init = init;
  this.newBlock = newBlock;
  this.newTransaction = newTransaction;
  this.getChain = getChain;
  this.checkChain = checkChain;
  this.mine = mine;

  this.chain;
  this.currentTransactions;

  function init(){
    /*
    *  initialize the blockchain, creating a new empty chain,
    *  an empty transactions list and creating the first block
    */
    self.chain = [];
    self.currentTransactions = [];
    //self.newBlock(100, 1);
    //self.newBlock(false, 1);
  }

  function getChain(){
    /*
    *  returns the chain
    */
    return self.chain;
  }

  function mine(miner){
    /*
    *  implements the mining function. simple as is, it just
    *  creates a new transaction with "sender" 0 to show that
    *  this is a mined block.
    */

    var lastBlock = self.chain[self.chain.length-1];
    var transaction = newTransaction(0,miner,1);
    var proof = validator.generateProof(transaction);
    console.log(`transaction verif ${transaction}`)
    var previousHash;
    if(self.chain.length == 0){
      previousHash = 0;
    }
    else {
      previousHash = validator.calculateHash(lastBlock.transaction[0]);
    }
    return newBlock(proof, previousHash);
  }

  function newBlock(proof, previousHash){
    /*
    *  Generate a new blocks and adds it to the chain
    */
    var block = {
      "index": self.chain.length+1,
      "timestamp": new Date().getTime(),
      "transaction": self.currentTransactions,
      "proof": proof,
      "previousHash": previousHash
    }
    self.currentTransactions = [];
    self.chain.push(block);
    return block;
  }

  function newTransaction(sender, receiver, amount){
    /*
    *  Generate a new transaction
    */
    var transaction = {
      sender: sender,
      receiver: receiver,
      amount: amount
    };
    self.currentTransactions.push(transaction);
    return transaction;
  }

  function checkChain(){

    // On va verfier si la chaine dans self.chain est corecte

    // Les choses à vérifier : le hash prècèdent de chaque bloc correspond bien au hash du bloc précédent
    // La preuve (proof) de chaque bloc est valide
    // La structure de chaque bloc est complète (index, timestamp, transaction, proof, previousHash)
    // Les indices des blocs sont séquentiels

    // On va parcourir la chaine qui contient des objets sous la forme :
    // var block = {
    //  "index": self.chain.length+1,
    //  "timestamp": new Date().getTime(),
    //  "transaction": self.currentTransactions,
    //  "proof": proof,
    //  "previousHash": previousHash
    
    indiceBloc = null

    for (let i = 0; i < self.chain.length; i++) {
      //-------------------------------------------------------------
      // VERIFICATION DES PARAMETRES DU BLOC
      //-------------------------------------------------------------


      if(!((self.chain[i].index !== null && self.chain[i].index !== undefined) 
        && (self.chain[i].timestamp !== null && self.chain[i].timestamp !== undefined)
        && (self.chain[i].transaction !== null && self.chain[i].transaction !== undefined)
        && (self.chain[i].proof !== null && self.chain[i].proof !== undefined)
        && (self.chain[i].previousHash !== null && self.chain[i].previousHash !== undefined))){
        
        //-------------------------------------------------------------
        // VERIFICATION DES PARAMETRES DU BLOC NON VALIDE
        //-------------------------------------------------------------

        
        console.log("Bloc Non Valide Identifié")
        return []
      }

      if(indiceBloc == null){
        // Lors du premier passage on va assigner le premiere valeur de bloc correcte
        indiceBloc = self.chain[i].index
      }
      

      //-------------------------------------------------------------
      // VERIFICATION DE LA PROOF OF WORK
      //-------------------------------------------------------------

      proofCheck = validator.generateProof(self.chain[i].transaction[self.chain[i].transaction.length-1])

      console.log(`transaction verif ${self.chain[i].transaction[self.chain[i].transaction.length-1]}`)

      if(proofCheck != self.chain[i].proof){
        //-------------------------------------------------------------
        // ERREUR DANS LA PROOF OF WORK
        //-------------------------------------------------------------
        console.log(`Proof n'est pas bonne : la proof calculée : ${proofCheck}  ${self.chain[i].proof}`)
        return []
      }

      //-------------------------------------------------------------
      // VERIFICATION DE L'ODRE CROISSANT DES INDEX
      //-------------------------------------------------------------

      if(self.chain[i].index < indiceBloc){
        //-------------------------------------------------------------
        // L'INDEX PRECEDENT EST PLUS GRAND
        //-------------------------------------------------------------
        console.log("L'index précédent est plus grand")
        return []
      }

      indiceBloc = self.chain[i].index 


      //-------------------------------------------------------------
      // VERIFICATION DU HASH PRECEDENT
      //-------------------------------------------------------------

      if(i>0){

        previousHashVerification = validator.calculateHash(self.chain[i-1].transaction[0])
        if(self.chain[i].previousHash != previousHashVerification){
          console.log("Le hash n'est pas bon")
          return []
        }
          
      }
    }

    return self.chain
  }


  if(blockchain.caller != blockchain.getInstance){
    throw new Error("This object cannot be instanciated");
  }

};


blockchain.instance = null;
blockchain.getInstance = function(){
	if(this.instance === null){
		this.instance = new blockchain();
	}
	return this.instance;
};

module.exports = blockchain.getInstance();
