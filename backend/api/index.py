"""Vercel Python runtime entrypoint: serve the FastAPI app via Mangum (ASGI -> serverless).

Services mode builds the `backend` service with root=backend, so this file
is the serverless function handling all routed requests.
"""
from mangum import Mangum

from app.main import app

handler = Mangum(app, lifespan="off")
