from fastapi import FastAPI
from .routes import menu, order


app = FastAPI(title="Cafe API")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(menu.router, prefix="/api")
app.include_router(order.router, prefix="/api")
