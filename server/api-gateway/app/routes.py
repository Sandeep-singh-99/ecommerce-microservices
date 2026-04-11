from fastapi import APIRouter, Request, HTTPException, Form, UploadFile, File, Response
import httpx
from app.config import USER_SERVICE_URL

router = APIRouter()

@router.post("/users/register")
async def register(
    response: Response,
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    profile_picture: UploadFile = File(None)
):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{USER_SERVICE_URL}/users/register",
            data={
                "email": email,
                "password": password,
                "full_name": full_name
            },
            files={"profile_picture": (
                profile_picture.filename,
                await profile_picture.read(),
                profile_picture.content_type
            )} if profile_picture else None
        )

    if "set-cookie" in res.headers:
        response.headers["set-cookie"] = res.headers["set-cookie"]

    return res.json()


@router.post("/users/login")
async def login(
    response: Response,
    email: str = Form(...),
    password: str = Form(...)
):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{USER_SERVICE_URL}/users/login",
            data={
                "email": email,
                "password": password
            }
        )

    if "set-cookie" in res.headers:
        response.headers["set-cookie"] = res.headers["set-cookie"]

    return res.json()


@router.get("/users/me")
async def get_me(request: Request):
    cookies = request.cookies

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{USER_SERVICE_URL}/users/me",
            cookies=cookies
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()


# @router.post("/users/logout")
# async def logout(request: Request):
#     cookies = request.cookies

#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             f"{USER_SERVICE_URL}/users/logout",
#             cookies=cookies
#         )

#     if response.status_code != 200:
#         raise HTTPException(status_code=response.status_code, detail=response.text)

#     return response.json()


@router.post("/users/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="none"
    )
    return {"message": "Logged out successfully"}