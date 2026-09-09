from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr


# ---------- MongoDB ----------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---------- FastAPI ----------
app = FastAPI(title="SertãoCast API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

JWT_ALGORITHM = "HS256"


# ---------- Helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    if not creds:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(
            creds.credentials, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM]
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado")
    return {"id": str(user["_id"]), "email": user["email"], "role": user["role"]}


# ---------- Models ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class EpisodeBase(BaseModel):
    title: str
    description: str
    category: str  # cultura, musica, humor, entrevistas, negocios
    duration: str  # e.g. "48:12"
    audio_url: Optional[str] = ""
    cover_url: Optional[str] = ""
    host: str = "SertãoCast"


class EpisodeCreate(EpisodeBase):
    pass


class Episode(EpisodeBase):
    id: str
    episode_number: int
    plays: int = 0
    published_at: str


class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    podcast_name: str
    date: str  # YYYY-MM-DD
    time_slot: str  # HH:MM
    duration_hours: int = 2
    equipment: List[str] = []
    notes: Optional[str] = ""


class Booking(BookingCreate):
    id: str
    status: str  # confirmed | cancelled
    created_at: str


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


# ---------- Auth ----------
@api_router.post("/auth/login")
async def login(body: LoginRequest):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    token = create_access_token(str(user["_id"]), user["email"], user.get("role", "user"))
    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user.get("role", "user"),
            "name": user.get("name", ""),
        },
    }


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


# ---------- Episodes ----------
@api_router.get("/episodes", response_model=List[Episode])
async def list_episodes(category: Optional[str] = None, q: Optional[str] = None):
    query = {}
    if category and category != "todos":
        query["category"] = category
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
        ]
    docs = await db.episodes.find(query).sort("episode_number", -1).to_list(500)
    return [
        Episode(
            id=str(d["_id"]),
            episode_number=d["episode_number"],
            title=d["title"],
            description=d["description"],
            category=d["category"],
            duration=d["duration"],
            audio_url=d.get("audio_url", ""),
            cover_url=d.get("cover_url", ""),
            host=d.get("host", "SertãoCast"),
            plays=d.get("plays", 0),
            published_at=d["published_at"],
        )
        for d in docs
    ]


@api_router.post("/episodes", response_model=Episode)
async def create_episode(body: EpisodeCreate, admin=Depends(get_current_admin)):
    last = await db.episodes.find_one(sort=[("episode_number", -1)])
    ep_num = (last["episode_number"] + 1) if last else 1
    doc = {
        **body.model_dump(),
        "episode_number": ep_num,
        "plays": 0,
        "published_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.episodes.insert_one(doc)
    doc["_id"] = result.inserted_id
    return Episode(
        id=str(doc["_id"]),
        episode_number=doc["episode_number"],
        title=doc["title"],
        description=doc["description"],
        category=doc["category"],
        duration=doc["duration"],
        audio_url=doc.get("audio_url", ""),
        cover_url=doc.get("cover_url", ""),
        host=doc.get("host", "SertãoCast"),
        plays=doc.get("plays", 0),
        published_at=doc["published_at"],
    )


@api_router.delete("/episodes/{episode_id}")
async def delete_episode(episode_id: str, admin=Depends(get_current_admin)):
    res = await db.episodes.delete_one({"_id": ObjectId(episode_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Episódio não encontrado")
    return {"success": True}


@api_router.post("/episodes/{episode_id}/play")
async def register_play(episode_id: str):
    await db.episodes.update_one({"_id": ObjectId(episode_id)}, {"$inc": {"plays": 1}})
    return {"success": True}


# ---------- Bookings ----------
@api_router.post("/bookings", response_model=Booking)
async def create_booking(body: BookingCreate):
    # Check conflict
    conflict = await db.bookings.find_one(
        {"date": body.date, "time_slot": body.time_slot, "status": "confirmed"}
    )
    if conflict:
        raise HTTPException(status_code=409, detail="Horário já reservado")
    doc = {
        **body.model_dump(),
        "status": "confirmed",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.bookings.insert_one(doc)
    return Booking(id=str(result.inserted_id), **{k: doc[k] for k in doc if k != "_id"})


@api_router.get("/bookings/availability")
async def get_availability(date: str):
    """Return list of booked time_slot strings for a given date."""
    docs = await db.bookings.find(
        {"date": date, "status": "confirmed"}, {"time_slot": 1}
    ).to_list(500)
    return {"date": date, "booked_slots": [d["time_slot"] for d in docs]}


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings(admin=Depends(get_current_admin)):
    docs = await db.bookings.find().sort("created_at", -1).to_list(1000)
    return [
        Booking(
            id=str(d["_id"]),
            name=d["name"],
            email=d["email"],
            phone=d["phone"],
            podcast_name=d["podcast_name"],
            date=d["date"],
            time_slot=d["time_slot"],
            duration_hours=d.get("duration_hours", 2),
            equipment=d.get("equipment", []),
            notes=d.get("notes", ""),
            status=d["status"],
            created_at=d["created_at"],
        )
        for d in docs
    ]


@api_router.patch("/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: str, admin=Depends(get_current_admin)):
    res = await db.bookings.update_one(
        {"_id": ObjectId(booking_id)}, {"$set": {"status": "cancelled"}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    return {"success": True}


@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, admin=Depends(get_current_admin)):
    res = await db.bookings.delete_one({"_id": ObjectId(booking_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    return {"success": True}


# ---------- Contact ----------
@api_router.post("/contact")
async def contact(body: ContactMessage):
    doc = {**body.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.contact_messages.insert_one(doc)
    return {"success": True}


@api_router.get("/contact")
async def list_contact(admin=Depends(get_current_admin)):
    docs = await db.contact_messages.find().sort("created_at", -1).to_list(500)
    return [
        {
            "id": str(d["_id"]),
            "name": d["name"],
            "email": d["email"],
            "subject": d["subject"],
            "message": d["message"],
            "created_at": d["created_at"],
        }
        for d in docs
    ]


# ---------- Stats ----------
@api_router.get("/stats")
async def stats(admin=Depends(get_current_admin)):
    total_episodes = await db.episodes.count_documents({})
    total_bookings = await db.bookings.count_documents({"status": "confirmed"})
    cancelled = await db.bookings.count_documents({"status": "cancelled"})
    total_messages = await db.contact_messages.count_documents({})
    plays_agg = await db.episodes.aggregate(
        [{"$group": {"_id": None, "total": {"$sum": "$plays"}}}]
    ).to_list(1)
    total_plays = plays_agg[0]["total"] if plays_agg else 0
    return {
        "total_episodes": total_episodes,
        "confirmed_bookings": total_bookings,
        "cancelled_bookings": cancelled,
        "total_messages": total_messages,
        "total_plays": total_plays,
    }


@api_router.get("/")
async def root():
    return {"message": "SertãoCast API online", "status": "ok"}


# ---------- Startup ----------
SEED_EPISODES = [
    {
        "title": "Ep. 01 — A Batida do Sertão",
        "description": "Uma imersão nos ritmos que fizeram a história: forró pé-de-serra, xote, baião e a nova cena do sertão.",
        "category": "musica",
        "duration": "52:14",
        "cover_url": "https://images.unsplash.com/photo-1615458317538-72c46d9359d8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxwb2RjYXN0JTIwc3R1ZGlvJTIwbWljcm9waG9uZSUyMG5lb24lMjBuZW9uJTIwZ3JlZW4lMjBsaWdodGluZyUyMHJhZGlvJTIwYnJvYWRjYXN0JTIwaG9zdCUyMG1pY3JvcGhvbmV8ZW58MHx8fHwxNzg4OTc4MzcxfDA&ixlib=rb-4.1.0&q=85",
        "host": "SertãoCast",
        "plays": 1247,
    },
    {
        "title": "Ep. 02 — Causos de Boteco",
        "description": "Histórias impossíveis, verdades improváveis. Rodada de causos, rimas e gargalhadas com a galera do bairro.",
        "category": "humor",
        "duration": "41:30",
        "cover_url": "https://images.unsplash.com/photo-1633933757597-2d09c360c2ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxwb2RjYXN0JTIwaG9zdCUyMHJlY29yZGluZyUyMG1pY3JvcGhvbmUlMjBzdHVkaW8lMjBuZW9ufGVufDB8fHx8MTc4ODk3ODM3OXww&ixlib=rb-4.1.0&q=85",
        "host": "SertãoCast",
        "plays": 892,
    },
    {
        "title": "Ep. 03 — Cultura Sem Filtro",
        "description": "Literatura de cordel, cinema nordestino, festivais e a força da identidade cultural na era do streaming.",
        "category": "cultura",
        "duration": "1:04:22",
        "cover_url": "https://images.unsplash.com/photo-1668537338628-85b9970bf17f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwc3R1ZGlvJTIwbWljcm9waG9uZSUyMG5lb24lMjBuZW9uJTIwZ3JlZW4lMjBsaWdodGluZyUyMHJhZGlvJTIwYnJvYWRjYXN0JTIwaG9zdCUyMG1pY3JvcGhvbmV8ZW58MHx8fHwxNzg4OTc4MzcxfDA&ixlib=rb-4.1.0&q=85",
        "host": "SertãoCast",
        "plays": 2103,
    },
    {
        "title": "Ep. 04 — Entrevista com Chico Violeiro",
        "description": "Cantador, poeta e engenheiro por acidente. Um bate-papo profundo sobre viola, tecnologia e raízes.",
        "category": "entrevistas",
        "duration": "58:47",
        "cover_url": "https://images.unsplash.com/photo-1659083726032-32d67d08ba64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxwb2RjYXN0JTIwaG9zdCUyMHJlY29yZGluZyUyMG1pY3JvcGhvbmUlMjBzdHVkaW8lMjBuZW9ufGVufDB8fHx8MTc4ODk3ODM3OXww&ixlib=rb-4.1.0&q=85",
        "host": "SertãoCast",
        "plays": 1590,
    },
    {
        "title": "Ep. 05 — Empreender no Interior",
        "description": "Marcas nascidas no sertão que rodam o Brasil. Como transformar cultura local em negócio global.",
        "category": "negocios",
        "duration": "47:09",
        "cover_url": "https://images.unsplash.com/photo-1615458317303-4bb49df432cc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHszfHxwb2RjYXN0JTIwc3R1ZGlvJTIwbWljcm9waG9uZSUyMG5lb24lMjBuZW9uJTIwZ3JlZW4lMjBsaWdodGluZyUyMHJhZGlvJTIwYnJvYWRjYXN0JTIwaG9zdCUyMG1pY3JvcGhvbmV8ZW58MHx8fHwxNzg4OTc4MzcxfDA&ixlib=rb-4.1.0&q=85",
        "host": "SertãoCast",
        "plays": 734,
    },
    {
        "title": "Ep. 06 — A Sanfona Não Morre",
        "description": "De Luiz Gonzaga aos DJs eletrônicos: como a sanfona continua reinventando a trilha do Brasil.",
        "category": "musica",
        "duration": "44:55",
        "cover_url": "https://images.unsplash.com/photo-1678640386878-e5bf984d00da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHxjYWN0dXMlMjBwbGFudCUyMGRlc2VydCUyMGRhcmslMjBsaWdodGluZyUyMG5lb258ZW58MHx8fHwxNzg4OTc4Mzc5fDA&ixlib=rb-4.1.0&q=85",
        "host": "SertãoCast",
        "plays": 1123,
    },
]


async def seed_data():
    admin_email = os.environ["ADMIN_EMAIL"].lower().strip()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one(
            {
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "SertãoCast Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )

    if await db.episodes.count_documents({}) == 0:
        for i, ep in enumerate(SEED_EPISODES, start=1):
            await db.episodes.insert_one(
                {
                    **ep,
                    "episode_number": i,
                    "audio_url": "",
                    "published_at": (
                        datetime.now(timezone.utc) - timedelta(days=(len(SEED_EPISODES) - i) * 7)
                    ).isoformat(),
                }
            )


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.episodes.create_index("episode_number")
    await db.bookings.create_index([("date", 1), ("time_slot", 1)])
    await seed_data()


# ---------- Wire up ----------
app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
