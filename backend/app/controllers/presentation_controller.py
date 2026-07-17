from bson import ObjectId
from app.database.mongodb import database
from app.models.presentation_model import PresentationModel


class PresentationController:

    @staticmethod
    async def create(data):
        document = PresentationModel.create_document(data)

        result = await database.presentations.insert_one(document)

        document["_id"] = str(result.inserted_id)

        return document

    @staticmethod
    async def get_all():
        presentations = []

        async for presentation in database.presentations.find():
            presentation["_id"] = str(presentation["_id"])
            presentations.append(presentation)

        return presentations

    @staticmethod
    async def get_by_id(id: str):
        presentation = await database.presentations.find_one(
            {"_id": ObjectId(id)}
        )

        if presentation:
            presentation["_id"] = str(presentation["_id"])

        return presentation

    @staticmethod
    async def update(id: str, data: dict):
        await database.presentations.update_one(
            {"_id": ObjectId(id)},
            {
                "$set": data
            }
        )

        return await PresentationController.get_by_id(id)

    @staticmethod
    async def delete(id: str):
        await database.presentations.delete_one(
            {
                "_id": ObjectId(id)
            }
        )

        return {
            "message": "Presentation Deleted"
        }