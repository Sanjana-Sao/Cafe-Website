from fastapi import FastAPI
from routes import auth, menu, order


app = FastAPI(title="Cafe API")


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(menu.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
