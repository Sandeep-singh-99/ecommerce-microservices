import cloudinary
import os
from dotenv import load_dotenv
import cloudinary.uploader
import cloudinary.api

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


# Upload Image
async def upload_image(file, folder: str = "fastapi_uploads"):
    """
    Upload image to Cloudinary.
    :param file: UploadFile object
    :param folder: folder name in Cloudinary
    :return: dict with url and public_id
    """
    try:
        # Read the file content
        file_content = await file.read()
        result = cloudinary.uploader.upload(file_content, folder=folder)
        return {
            "secure_url": result["secure_url"],
            "public_id": result["public_id"]
        }
    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {str(e)}")
    
def upload_multiple_images(file, folder: str = "fastapi_uploads"):
    try:
        file_content = file.read()   # ❗ no await
        result = cloudinary.uploader.upload(file_content, folder=folder)

        return {
            "secure_url": result["secure_url"],
            "public_id": result["public_id"]
        }
    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {str(e)}")

# Delete Image
def delete_image(public_id: str):
    """
    Delete image from Cloudinary.
    :param public_id: Cloudinary public_id of the image
    :return: success message
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        if result.get("result") == "ok":
            return {"message": "Image deleted successfully"}
        return {"message": "Image not found or already deleted"}
    except Exception as e:
        raise Exception(f"Cloudinary delete failed: {str(e)}")