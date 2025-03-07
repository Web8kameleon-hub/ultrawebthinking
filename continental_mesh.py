import asyncio
import random

# Definimi i nyjeve sipas hierarkisë ushtarake
class Node:
    def __init__(self, node_id, role, parent=None):
        self.node_id = node_id
        self.role = role
        self.parent = parent
        self.children = []
        self.is_active = True

    async def execute_task(self):
        await asyncio.sleep(random.uniform(0.01, 0.05))  # Simulon vonesën
        print(f"✅ {self.role} {self.node_id} kreu detyrën dhe u fik.")
        self.is_active = False  # Nyja fiket pas përfundimit të detyrës

    async def send_message(self, message):
        if self.parent:
            print(f"��� {self.role} {self.node_id} dërgon mesazh te {self.parent.role} {self.parent.node_id}: {message}")
            await self.parent.receive_message(message)

    async def receive_message(self, message):
        print(f"�� {self.role} {self.node_id} mori mesazh: {message}")
        if self.parent:
            await self.send_message(message)

# Krijimi i rrjetit Mesh sipas kontinenteve
async def build_continental_mesh():
    # Komanda Qendrore
    command_center = Node("Komanda-Qendrore", "���")

    # Kontinente
    amerika = Node("Komanda-Amerika", "���", parent=command_center)
    europa = Node("Komanda-Europa", "���", parent=command_center)
    azia = Node("Komanda-Azia", "���", parent=command_center)
    afrika = Node("Komanda-Afrika", "���", parent=command_center)
    command_center.children.extend([amerika, europa, azia, afrika])

    # Divizionet në secilin kontinent
    divisions = []
    for continent in [amerika, europa, azia, afrika]:
        div = Node(f"Divizion-{continent.node_id}", "⚔️", parent=continent)
        continent.children.append(div)
        divisions.append(div)

    # Brigadat në secilin divizion
    brigades = []
    for div in divisions:
        brig = Node(f"Brigada-{div.node_id}", "���", parent=div)
        div.children.append(brig)
        brigades.append(brig)

    # Batalionet në secilën brigadë
    battalions = []
    for brig in brigades:
        batt = Node(f"Batalion-{brig.node_id}", "���️", parent=brig)
        brig.children.append(batt)
        battalions.append(batt)

    # Kompanitë në secilin batalion
    companies = []
    for batt in battalions:
        comp = Node(f"Kompania-{batt.node_id}", "���", parent=batt)
        batt.children.append(comp)
        companies.append(comp)

    # Togat në secilën kompani
    platoons = []
    for comp in companies:
        pl = Node(f"Toga-{comp.node_id}", "���️", parent=comp)
        comp.children.append(pl)
        platoons.append(pl)

    # Ushtarët në secilën togë
    soldiers = []
    for pl in platoons:
        soldier = Node(f"Ushtar-{pl.node_id}", "���", parent=pl)
        pl.children.append(soldier)
        soldiers.append(soldier)

    # Simulimi i detyrave dhe dërgimit të mesazheve
    tasks = [node.execute_task() for node in soldiers]
    await asyncio.gather(*tasks)

    # Korrierët dërgojnë informacionin në rrjet
    message = "Urdhër nga Komanda-Qendrore!"
    await europa.send_message(message)

asyncio.run(build_continental_mesh())
