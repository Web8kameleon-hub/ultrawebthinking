import hashlib
import time
import random
import asyncio
import json
import logging
from fastapi import FastAPI, HTTPException
from typing import List, Dict, Optional
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
from hashlib import sha256

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
logger = logging.getLogger()

app = FastAPI()

# ✅ Layer-1: Blloku dhe Blockchain-i Bazë
class Block:
    def __init__(self, index, previous_hash, transactions, timestamp=None):
        self.index = index
        self.previous_hash = previous_hash
        self.transactions = transactions
        self.timestamp = timestamp or time.time()
        self.nonce = 0
        self.hash = self.mine_block()

    def mine_block(self, difficulty=4):
        """ Simulimi i proof-of-work me hash SHA-256 """
        while True:
            self.nonce += 1
            block_hash = self.calculate_hash()
            if block_hash[:difficulty] == "0" * difficulty:
                return block_hash

    def calculate_hash(self):
        """ Llogarit hash-in e bllokut """
        block_string = json.dumps({
            "index": self.index,
            "previous_hash": self.previous_hash,
            "transactions": self.transactions,
            "timestamp": self.timestamp,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.pending_transactions = []
        self.difficulty = 4

    def create_genesis_block(self):
        """ Krijon bllokun e parë të rrjetit """
        return Block(0, "0", "Genesis Block")

    def add_transaction(self, sender, receiver, amount):
        """ Shton një transaksion të ri në mempool """
        transaction = {"sender": sender, "receiver": receiver, "amount": amount}
        self.pending_transactions.append(transaction)

    async def process_transactions(self):
        """ Krijon një bllok të ri me transaksionet në pritje """
        if not self.pending_transactions:
            return "⏳ Nuk ka transaksione për t'u përpunuar"

        new_block = Block(len(self.chain), self.chain[-1].hash, self.pending_transactions)
        self.chain.append(new_block)
        self.pending_transactions = []
        return f"✅ Blloku #{new_block.index} u minua me sukses! Hash: {new_block.hash}"

# ✅ Layer-2: Shkallëzueshmëria (Rollups)
class Layer2:
    def __init__(self):
        self.rollup_batches = []

    def add_to_rollup(self, transactions):
        self.rollup_batches.append(transactions)

    def process_rollup(self):
        """ Kombinon transaksionet dhe i shton në Layer-1 """
        return self.rollup_batches.pop(0) if self.rollup_batches else []

# ✅ Layer-3: API dhe Aplikacionet
@app.post("/transactions/")
def create_transaction(sender: str, receiver: str, amount: float):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Shuma duhet të jetë pozitive")
    blockchain.add_transaction(sender, receiver, amount)
    return {"message": "Transaksioni u shtua me sukses!"}

@app.get("/mine/")
async def mine_block():
    result = await blockchain.process_transactions()
    return {"message": result}

@app.get("/chain/")
def get_chain():
    chain_data = [{"index": block.index, "previous_hash": block.previous_hash, "transactions": block.transactions, "timestamp": block.timestamp, "hash": block.hash} for block in blockchain.chain]
    return {"length": len(blockchain.chain), "chain": chain_data}

# ✅ Layer-4: Ndërveprimi midis Blockchain-eve
class Interoperability:
    def __init__(self):
        self.connected_chains = {}

    def connect_chain(self, name, blockchain):
        self.connected_chains[name] = blockchain

    def transfer_assets(self, from_chain, to_chain, asset):
        if from_chain in self.connected_chains and to_chain in self.connected_chains:
            return f"Asset {asset} transferred from {from_chain} to {to_chain}"
        return "Transferimi dështoi"

# ✅ Layer-4.5: Qeverisja dhe Monitorimi
class Governance:
    def __init__(self):
        self.proposals = []

    def create_proposal(self, proposal):
        self.proposals.append({"proposal": proposal, "votes": []})

    def vote(self, proposal_index, vote):
        if 0 <= proposal_index < len(self.proposals):
            self.proposals[proposal_index]["votes"].append(vote)
            return "Vota u regjistrua"
        return "Propozimi nuk ekziston"

class MerkleTree:
    def __init__(self, transactions):
        self.transactions = transactions
        self.tree = self.build_tree(transactions)

    def build_tree(self, transactions):
        if len(transactions) == 1:
            return transactions
        new_level = []
        for i in range(0, len(transactions), 2):
            left = transactions[i]
            right = transactions[i + 1] if i + 1 < len(transactions) else left
            new_level.append(sha256((left + right).encode()).hexdigest())
        return self.build_tree(new_level)

    def get_root(self):
        return self.tree[0]

# ✅ Inicimi i Blockchain-it dhe Shtresave
blockchain = Blockchain()
layer2 = Layer2()
interop = Interoperability()
governance = Governance()

# ✅ Simulimi i Rrjetit
async def simulate_hybrid_blockchain():
    blockchain.add_transaction("Alice", "Bob", 50)
    blockchain.add_transaction("Charlie", "Dave", 75)
    await blockchain.process_transactions()

    layer2.add_to_rollup([{"sender": "Eve", "receiver": "Frank", "amount": 100}])
    rollup = layer2.process_rollup()
    for tx in rollup:
        blockchain.add_transaction(tx["sender"], tx["receiver"], tx["amount"])
    await blockchain.process_transactions()

    interop.connect_chain("ChainA", blockchain)
    interop.connect_chain("ChainB", Blockchain())
    print(interop.transfer_assets("ChainA", "ChainB", "TokenX"))

    governance.create_proposal({"title": "Increase Block Size", "votes": []})
    print(governance.vote(0, "Yes"))

    # Generate keys
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()

    # Sign transaction
    signature = private_key.sign(
        tx.tx_hash.encode(),
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
        hashes.SHA256()
    )

    # Verify signature
    public_key.verify(
        signature,
        tx.tx_hash.encode(),
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
        hashes.SHA256()
    )

    logger.info(f"Transaction {tx.tx_hash} committed successfully")

    # Example: Enhanced Cross-Shard Transaction with Digital Signatures
    tx = CrossShardTransaction(
        sender_shard=0,
        receiver_shard=1,
        transaction={
            'sender': 'alice',
            'receiver': 'bob',
            'amount': '25.0',
            'signature': signature.hex()  # Use actual cryptographic signature
        }
    )

    # Validate and commit
    if tx.validate(shards):
        if tx.commit(shards):
            print("Transaction committed successfully!")
            print("Final state:")
            print(f"Shard 0 balances: {shards[0].accounts}")
            print(f"Shard 1 balances: {shards[1].accounts}")
        else:
            print("Transaction failed to commit")
    else:
        print("Transaction validation failed")

def add_shard(shards, shard_id):
    shards[shard_id] = Shard(shard_id)

# ✅ Nisja e Simulimit
asyncio.run(simulate_hybrid_blockchain())