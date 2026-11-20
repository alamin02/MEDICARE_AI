from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Hospital

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])

@router.get("/")
def get_hospitals(city: str = None, emergency_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Hospital)
    if city:
        query = query.filter(Hospital.city.ilike(f"%{city}%"))
    if emergency_only:
        query = query.filter(Hospital.emergency_available == True)
    return query.all()
