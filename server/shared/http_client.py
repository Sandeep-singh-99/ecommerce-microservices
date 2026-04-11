import httpx

async def get_request(url: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

async def post_request(url: str, data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data)
        return response.json()