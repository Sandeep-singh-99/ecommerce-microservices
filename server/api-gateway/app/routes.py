from fastapi import APIRouter, Request, HTTPException
import httpx
from app.config import USER_SERVICE_URL

router = APIRouter()

@router.post("/users/register")
async def register(request: Request):
    form = await request.form()

    files = {}
    data = {}

    for key, value in form.multi_items():
        if hasattr(value, "filename"):
            files[key] = (value.filename, await value.read(), value.content_type)
        else:
            data[key] = value

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/auth/register",
            data=data,
            files=files
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()


@router.post("/users/login")
async def login(request: Request):
    form = await request.form()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/auth/login",
            data=form
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    # ✅ Forward cookies to client
    res = response.json()

    return res


@router.get("/users/me")
async def get_me(request: Request):
    cookies = request.cookies

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{USER_SERVICE_URL}/auth/me",
            cookies=cookies
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()


@router.post("/users/logout")
async def logout(request: Request):
    cookies = request.cookies

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{USER_SERVICE_URL}/auth/logout",
            cookies=cookies
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()