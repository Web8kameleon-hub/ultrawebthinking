from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Model për të dhënat e inputit
class Item(BaseModel):
    name: str
    description: str = None
    price: float
    in_stock: bool

# Endpoint kryesor
@app.get("/")
def read_root():
    return {"message": "API funksionon!"}

# Endpoint për të krijuar një element të ri
@app.post("/create/")
def create_item(item: Item):
    return {"message": "Të dhënat u shtuan me sukses!", "item": item}