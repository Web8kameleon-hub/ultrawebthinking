import asyncio
import random

# Definimi i nyjeve sipas hierarkisÃ« ushtarake
class Node:
    def __init__(self, node_id, role, parent=None):
        self.node_id = node_id
        self.role = role
        self.parent = parent
        self.children = []
        self.is_active = True

    async def execute_task(self):
        await asyncio.sleep(random.uniform(0.01, 0.05))  # Simulon vonesÃ«n
        print(f"âœ… {self.role} {self.node_id} kreu detyrÃ«n dhe u fik.")
        self.is_active = False  # Nyja fiket pas pÃ«rfundimit tÃ« detyrÃ«s

    async def send_message(self, message):
        if self.parent:
            print(f"í³© {self.role} {self.node_id} dÃ«rgon mesazh te {self.parent.role} {self.parent.node_id}: {message}")
            await self.parent.receive_message(message)

    async def receive_message(self, message):
        print(f"ï¿½ï¿½ {self.role} {self.node_id} mori mesazh: {message}")
        if self.parent:
            await self.send_message(message)

# Krijimi i rrjetit Mesh sipas kontinenteve
async def build_continental_mesh():
    # Komanda Qendrore
    command_center = Node("Komanda-Qendrore", "í¼")

    # Kontinente
    amerika = Node("Komanda-Amerika", "í¼", parent=command_center)
    europa = Node("Komanda-Europa", "í¼", parent=command_center)
    azia = Node("Komanda-Azia", "í¼", parent=command_center)
    afrika = Node("Komanda-Afrika", "í¼", parent=command_center)
    command_center.children.extend([amerika, europa, azia, afrika])

    # Divizionet nÃ« secilin kontinent
    divisions = []
    for continent in [amerika, europa, azia, afrika]:
        div = Node(f"Divizion-{continent.node_id}", "âš”ï¸", parent=continent)
        continent.children.append(div)
        divisions.append(div)

    # Brigadat nÃ« secilin divizion
    brigades = []
    for div in divisions:
        brig = Node(f"Brigada-{div.node_id}", "í¿°", parent=div)
        div.children.append(brig)
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
        soldier = Node(f"Ushtar-{pl.node_id}", "íº–", parent=pl)
        pl.children.append(soldier)
        soldiers.append(soldier)

    # Simulimi i detyrave dhe dÃ«rgimit tÃ« mesazheve
    tasks = [node.execute_task() for node in soldiers]
    await asyncio.gather(*tasks)

    # KorrierÃ«t dÃ«rgojnÃ« informacionin nÃ« rrjet
    message = "UrdhÃ«r nga Komanda-Qendrore!"
    await europa.send_message(message)

asyncio.run(build_continental_mesh())
