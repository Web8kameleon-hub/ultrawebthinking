import logging
from typing import Dict

# Konfigurimi i logimit
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
logger = logging.getLogger()

class ReturnToOrigin:
    def __init__(self):
        self.rollback_log = []

    def record(self, shard_id: int, account: str, amount: float):
        """Regjistron një ndryshim për rollback"""
        self.rollback_log.append({
            "shard_id": shard_id,
            "account": account,
            "amount": amount
        })
        logger.info(f"📋 Regjistruar për rollback: Shard {shard_id}, Account {account}, Amount {amount}")

    def execute(self, shards: Dict[int, 'Shard']):
        """Ekzekuton rollback-in për të gjitha shards"""
        if not self.rollback_log:
            logger.warning("⚠️ Nuk ka transaksione për rollback.")
            return "⚠️ Nuk ka transaksione për rollback."

        for entry in self.rollback_log:
            shard = shards.get(entry["shard_id"])
            if not shard:
                logger.error(f"❌ Shard {entry['shard_id']} nuk ekziston!")
                continue

            if entry["account"] in shard.accounts:
                shard.accounts[entry["account"]] += entry["amount"]
                logger.info(f"⤴️ Rikthyer {entry['amount']} te llogaria {entry['account']} në Shard {entry['shard_id']}")
            else:
                shard.accounts[entry["account"]] = entry["amount"]
                logger.info(f"➕ Krijuar llogari të re {entry['account']} me {entry['amount']} në Shard {entry['shard_id']}")

        self.rollback_log.clear()
        logger.info("✅ Rollback i përfunduar me sukses.")
        return "⤴️ Transaksionet u kthyen në origjinë me sukses."








