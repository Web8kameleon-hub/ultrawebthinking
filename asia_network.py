import asyncio
import random
import psutil
import time

# Klasa pÃ«r Ã§do nyje nÃ« rrjet
class Node:
    def __init__(self, node_id, role, parent=None):
        self.node_id = node_id
        self.role = role
        self.parent = parent
        self.children = []
        self.is_active = True

    async def execute_task(self):
        """Simulon njÃ« nyje qÃ« kryen njÃ« detyrÃ« dhe mÃ« pas fiket."""
        await asyncio.sleep(random.uniform(0.001, 0.005))  # Optimizuar pÃ«r miliarda nyje
        print(f"âœ… {self.role} {self.node_id} kreu detyrÃ«n dhe u fik.")
        self.is_active = False  

    async def send_message(self, message):
        """DÃ«rgon njÃ« mesazh te nyja prind."""
        if self.parent:
            print(f"í³© {self.role} {self.node_id} dÃ«rgon mesazh te {self.parent.role} {self.parent.node_id}: {message}")
            await self.parent.receive_message(message)

    async def receive_message(self, message):
        """Merr njÃ« mesazh dhe e transmeton mÃ« lart nÃ« hierarki."""
        print(f"í³¬ {self.role} {self.node_id} mori mesazh: {message}")
        if self.parent:
            await self.send_message(message)

# Monitorimi i performancÃ«s
def monitor_performance():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    print(f"ï¿½ï¿½ CPU Usage: {cpu_usage}% | Memory Usage: {memory_info.percent}%")

# Krijimi i rrjetit Mesh pÃ«r AzinÃ« me ndarje shtetÃ«rore dhe rajonale
async def build_asia_network():
    start_time = time.time()

    # Komanda Qendrore
    command_center = Node("Komanda-Qendrore", "í¼")

    # Komanda e AzisÃ«
    asia_command = Node("Komanda-Azia", "í¼", parent=command_center)
    command_center.children.append(asia_command)

    # Shtetet kryesore nÃ« Azi
    china_command = Node("Komanda-Kina", "í·¨í·³", parent=asia_command)
    india_command = Node("Komanda-India", "í·®í·³", parent=asia_command)
    japan_command = Node("Komanda-Japonia", "í·¯í·µ", parent=asia_command)
    russia_command = Node("Komanda-Rusia", "í··í·º", parent=asia_command)
    asia_command.children.extend([china_command, india_command, japan_command, russia_command])

    # Rajonet e KinÃ«s
    china_regions = [Node(f"Rajoni-Kina-{i}", "í¿°", parent=china_command) for i in range(1, 10)]
    china_command.children.extend(china_regions)

    # Rajonet e IndisÃ«
    india_regions = [Node(f"Rajoni-India-{i}", "í¿°", parent=india_command) for i in range(1, 10)]
    india_command.children.extend(india_regions)

    # Brigadat nÃ« secilin rajon
    brigades = []
    for region in china_regions + india_regions:
        brig = Node(f"Brigada-{region.node_id}", "í¿°", parent=region)
        region.children.append(brig)
        brigades.append(brig)

    # Batalionet nÃ« secilÃ«n brigadÃ«
    battalions = []
    for brig in brigades:
        batt = Node(f"Batalion-{brig.node_id}", "í¿›ï¸", parent=brig)
        brig.children.append(batt)
        battalions.append(batt)

    # KompanitÃ« nÃ« secilin batalion
    companies = []
    for batt in battalions:
        comp = Node(f"Kompania-{batt.node_id}", "í¿…", parent=batt)
        batt.children.append(comp)
        companies.append(comp)

    # Togat nÃ« secilÃ«n kompani
    platoons = []
    for comp in companies:
        pl = Node(f"Toga-{comp.node_id}", "í¾–ï¸", parent=comp)
        comp.children.append(pl)
        platoons.append(pl)

    # UshtarÃ«t nÃ« secilÃ«n togÃ«
    soldiers = []
    for pl in platoons:
        for i in range(10):  # 10 ushtarÃ« pÃ«r togÃ«
            soldier = Node(f"Ushtar-{pl.node_id}-{i}", "íº–", parent=pl)
            pl.children.append(soldier)
            soldiers.append(soldier)

    # Simulimi i detyrave pÃ«r miliarda nyje
    tasks = [node.execute_task() for node in soldiers]
    await asyncio.gather(*tasks)

    # KorrierÃ«t dÃ«rgojnÃ« informacionin
    message = "UrdhÃ«r nga Komanda-Qendrore pÃ«r AzinÃ«!"
    await asia_command.send_message(message)

    # Monitorimi i performancÃ«s
    monitor_performance()

    end_time = time.time()
    print(f"â±ï¸ Koha totale e ekzekutimit: {round(end_time - start_time, 2)} sekonda")

asyncio.run(build_asia_network())
