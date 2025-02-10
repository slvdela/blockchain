var addressUtilities = require('../utils/address');
var arrayUtilities = require('../utils/array');

var network = function network(){

  var self = this;

  this.init = init;
  this.registerNode = registerNode;
  this.getNodes = getNodes;
  this.nodeExists = nodeExists;

  this.nodes;

  function init(){
    self.nodes = [];
  }

  function registerNode(address){
    // On va chercher à recuperer l'adresse IP et le port de la personne qui fait la requête
    var fixedAddress = addressUtilities.parseAddress(address);
    // On ajoute l'ip si elle n'est pas déjà dedans 
    var found = arrayUtilities.addToSet(self.nodes, fixedAddress, ['host', 'port']);
    return !found;
  }

  function getNodes(){
    return self.nodes;
  }

  function nodeExists(node){
    var found = false;
    node = addressUtilities.parseAddress(node);
    self.nodes.forEach(function(thisNode){
      if(thisNode.host === node.host && thisNode.port === node.port){
        found = true;
      }
    });
    return found;
  }

  if(network.caller != network.getInstance){
    throw new Error("This object cannot be instanciated");
  }

};


network.instance = null;
network.getInstance = function(){
	if(this.instance === null){
		this.instance = new network();
	}
	return this.instance;
};

module.exports = network.getInstance();
