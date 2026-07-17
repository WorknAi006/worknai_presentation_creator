from datetime import datetime


class PresentationModel:

    @staticmethod
    def create_document(data: dict):
        return {
            "title": data["title"],
            "slides": data["slides"],
            "thumbnail": data.get("thumbnail"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }