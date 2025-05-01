import asyncio
import random
import psutil
import time
import logging

# Konfigurimi i logimit
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Klasa për çdo nyje në rrjet
class Node:
    def __init__(self, node_id, role, parent=None):
        self.node_id = node_id
        self.role = role
        self.parent = parent
        self.children = []
        self.is_active = True

    async def execute_task(self):
        """Simulon një nyje që kryen një detyrë dhe më pas fiket."""
        await asyncio.sleep(random.uniform(0.001, 0.005))  # Optimizuar për miliarda nyje
        logging.info(f"✅ {self.role} {self.node_id} kreu detyrën dhe u fik.")
        self.is_active = False  

    async def send_message(self, message):
        """Dërgon një mesazh te nyja prind."""
        if self.parent:
            logging.info(f"📩 {self.role} {self.node_id} dërgon mesazh te {self.parent.role} {self.parent.node_id}: {message}")
            await self.parent.receive_message(message)

    async def receive_message(self, message):
        """Merr një mesazh dhe e transmeton më lart në hierarki."""
        logging.info(f"📩 {self.role} {self.node_id} mori mesazh: {message}")
        if self.parent:
            await self.send_message(message)

# Monitorimi i performancës
def monitor_performance():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    logging.info(f"📊 CPU Usage: {cpu_usage}% | Memory Usage: {memory_info.percent}%")

# Krijimi i rrjetit Mesh për Azinë me ndarje shtetërore dhe rajonale
async def build_asia_network():
    start_time = time.time()

    # Komanda Qendrore
    command_center = Node("Komanda-Qendrore", "HQ")

    # Komanda e Azisë
    asia_command = Node("Komanda-Azia", "Kontinent", parent=command_center)
    command_center.children.append(asia_command)

    # Shtetet kryesore në Azi
    china_command = Node("Komanda-Kina", "Shtet", parent=asia_command)
    india_command = Node("Komanda-India", "Shtet", parent=asia_command)
    japan_command = Node("Komanda-Japonia", "Shtet", parent=asia_command)
    russia_command = Node("Komanda-Rusia", "Shtet", parent=asia_command)
    asia_command.children.extend([china_command, india_command, japan_command, russia_command])

    # Rajonet e Kinës
    china_regions = [Node(f"Rajoni-Kina-{i}", "Rajon", parent=china_command) for i in range(1, 10)]
    china_command.children.extend(china_regions)

    # Rajonet e Indisë
    india_regions = [Node(f"Rajoni-India-{i}", "Rajon", parent=india_command) for i in range(1, 10)]
    india_command.children.extend(india_regions)

    # Brigadat në secilin rajon
    brigades = []
    for region in china_regions + india_regions:
        brig = Node(f"Brigada-{region.node_id}", "Brigadë", parent=region)
        region.children.append(brig)
        brigades.append(brig)

    # Batalionet në secilën brigadë
    battalions = []
    for brig in brigades:
        batt = Node(f"Batalion-{brig.node_id}", "Batalion", parent=brig)
        brig.children.append(batt)
        battalions.append(batt)

    # Kompanitë në secilin batalion
    companies = []
    for batt in battalions:
        comp = Node(f"Kompania-{batt.node_id}", "Kompani", parent=batt)
        batt.children.append(comp)
        companies.append(comp)

    # Togat në secilën kompani
    platoons = []
    for comp in companies:
        pl = Node(f"Toga-{comp.node_id}", "Togë", parent=comp)
        comp.children.append(pl)
        platoons.append(pl)

    # Ushtarët në secilën togë
    soldiers = []
    for pl in platoons:
        for i in range(10):  # 10 ushtarë për togë
            soldier = Node(f"Ushtar-{pl.node_id}-{i}", "Ushtar", parent=pl)
            pl.children.append(soldier)
            soldiers.append(soldier)

    # Simulimi i detyrave për miliarda nyje
    tasks = [node.execute_task() for node in soldiers]
    await asyncio.gather(*tasks)

    # Korrierët dërgojnë informacionin
    message = "Urdhër nga Komanda-Qendrore për Azinë!"
    await asia_command.send_message(message)

    # Monitorimi i performancës
    monitor_performance()

    end_time = time.time()
    logging.info(f"⏱️ Koha totale e ekzekutimit: {round(end_time - start_time, 2)} sekonda")

asyncio.run(build_asia_network())
