from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class PresentationCreate(BaseModel):
    title: str
    slides: List[Dict[str, Any]]
    thumbnail: Optional[str] = None


class PresentationUpdate(BaseModel):
    title: Optional[str] = None
    slides: Optional[List[Dict[str, Any]]] = None
    thumbnail: Optional[str] = None


class PresentationResponse(BaseModel):
    id: str
    title: str
    slides: List[Dict[str, Any]]
    thumbnail: Optional[str] = None