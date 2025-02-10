### Blockchain.js

* **newBlock** (proof, previousHash) => block
  Generate a new block given the already calculated proof and the previous Hash and returns the obtained block
* **newTransaction** (sender, receiver, amount) => transaction
  Generate a new transaction and adds it to the currentTransactions array which will be added in the next new block
* **mine** (miner) => block
  Mines a new block, assigns it to the miner and generate the associated block

### Network.js

* **registerNode** (address) => boolean
  Enable the insertion of new nodes and returns if the address has been added (cannot add twice the same address)
* **nodeExists** (address) => boolean
  Fetches in the nodes array if the provided node already exists and returns this information

### Analyse critique de la proof of work 

La Proof of Work est générée uniquement à partir d’une seule transaction créée lors du minage d’un bloc. Cette approche présente une vulnérabilité importante, car elle facilite la falsification de la preuve de travail.

De plus, le calcul de cette preuve est excessivement simple : il repose uniquement sur le numéro de port, ce qui entraîne une Proof Of Work identique pour chaque bloc. Cette uniformité compromet la sécurité de la blockchain, car elle permet d’ajouter facilement des blocs frauduleux tout en les faisant apparaître comme légitimes. En conséquence, l’intégrité et l’immutabilité de la blockchain sont menacées, rendant le réseau vulnérable aux attaques.