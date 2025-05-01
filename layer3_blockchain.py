import hashlib
import time
import random
import asyncio
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()

# ✅ Klasa e Bllokut Blockchain
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

# ✅ Klasa e Blockchain Layer-3
class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.pending_transactions = []

    def create_genesis_block(self):
        """ Krijon bllokun e parë të rrjetit """
        return Block(0, "0", "Genesis Block")

    def add_transaction(self, sender, receiver, amount):
        """ Shton një transaksion të ri në mempool """
        transaction = {
            "sender": sender,
            "receiver": receiver,
            "amount": amount
        }
        self.pending_transactions.append(transaction)

    async def process_transactions(self):
        """ Krijon një bllok të ri me transaksionet në pritje """
        if not self.pending_transactions:
            return "⏳ Nuk ka transaksione për t'u përpunuar"

        new_block = Block(len(self.chain), self.chain[-1].hash, self.pending_transactions)
        self.chain.append(new_block)
        self.pending_transactions = []

        return f"✅ Blloku #{new_block.index} u minua me sukses! Hash: {new_block.hash}"

# ✅ Simulimi i Rrjetit Layer-3
async def simulate_layer3_network():
    blockchain = Blockchain()

    # ✅ Shtimi i disa transaksioneve
    for i in range(5):
        sender = f"Node-{random.randint(1, 1000)}"
        receiver = f"Node-{random.randint(1, 1000)}"
        amount = random.randint(1, 100)
        blockchain.add_transaction(sender, receiver, amount)

    # ✅ Minimi i bllokut të ri
    result = await blockchain.process_transactions()
    print(result)

    # ✅ Monitorimi i blockchain
    print("\n🔗 Blockchain aktual:")
    for block in blockchain.chain:
        print(f"🔗 Blloku #{block.index} | Hash: {block.hash} | Prev: {block.previous_hash}")

# ✅ Endpoint-et e API-së
@app.get("/")
def read_root():
    """
    Endpoint kryesor që kthen një mesazh të thjeshtë.
    """
    return {"message": "API funksionon!"}

@app.post("/transactions/")
def create_transaction(sender: str, receiver: str, amount: float):
    """
    Krijon një transaksion të ri dhe e shton në mempool.
    """
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Shuma duhet të jetë pozitive")
    blockchain.add_transaction(sender, receiver, amount)
    return {"message": "Transaksioni u shtua me sukses!"}

@app.get("/mine/")
async def mine_block():
    """
    Minon një bllok të ri me transaksionet në pritje.
    """
    result = await blockchain.process_transactions()
    return {"message": result}

@app.get("/chain/")
def get_chain():
    """
    Merr të gjithë blockchain-in.
    """
    chain_data = [{"index": block.index, "previous_hash": block.previous_hash, "transactions": block.transactions, "timestamp": block.timestamp, "hash": block.hash} for block in blockchain.chain]
    return {"length": len(blockchain.chain), "chain": chain_data}

# ✅ Nisja e simulimit të rrjetit
blockchain = Blockchain()
asyncio.run(simulate_layer3_network())
