from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, menu, order
from config.config import settings


app = FastAPI(title="Cafe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sanjana-sao.github.io",
        "http://localhost:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(menu.router, prefix="/api")
app.include_router(order.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.HOST, port=settings.PORT, log_level="info")
