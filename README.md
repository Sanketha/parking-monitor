🚗 Parking Monitor – IoT Backend

A cloud-ready IoT backend for monitoring parking slot availability in real time using MQTT, Node.js, and PostgreSQL.
The system subscribes to HiveMQ topics, processes sensor updates, persists slot status, and exposes REST APIs for a mobile application.

📌 Features

📡 MQTT Subscriber (HiveMQ Cloud)

🅿️ Real-time parking slot status updates

⏱️ Reservation logic with expiration handling

🗄️ PostgreSQL database for persistence

🌍 REST APIs for mobile apps (Android / iOS)

🐳 Docker & Docker Compose support

☁️ Deployable on free cloud platforms (Railway / Render)

🧱 Architecture Overview
```
Sensors / Simulator
        ↓
   HiveMQ Cloud (MQTT)
        ↓
  Node.js Backend (Subscriber + REST API)
        ↓
    PostgreSQL Database
        ↓
   Mobile App / Client
```
📂 Project Structure
```
parking-monitor/
├── server.js            # App entry point
├── mqttClient.js        # MQTT subscriber logic
├── db.js                # Database access layer
├── routes.js            # REST API routes
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env
└── db_script            # Database schema      
```

🛠️ Tech Stack
```
Node.js (Express)

MQTT (HiveMQ Cloud)

PostgreSQL

Docker & Docker Compose

Google Maps API (mobile client)
```

⚙️ Environment Variables
```
Create a .env file in parking-monitor/:

PORT=3000

# PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_USER=parking
POSTGRES_PASSWORD=parking
POSTGRES_DB=parking_db
POSTGRES_PORT=5432

# HiveMQ
HIVEMQ_URL=mqtts://<your-hivemq-host>:8883
```

🗄️ Database Schema

Tables used:
```
parking_slots – static slot metadata (location)

slot_status – latest slot state

status_history – status change history
```
🚀 Run Locally (Docker – Recommended)

1️⃣ Build & start services
```
docker compose up --build
```

This starts:
```
Node.js backend

PostgreSQL database
```

2️⃣ Verify services
```
GET http://localhost:3000/api/slots
```

🔌 MQTT Topics

The backend subscribes to:
```
parking/slot/+/status
```

Expected payload example:
```
{
  "slotId": 1,
  "occupied": true,
  "magnetic": {
    "x": 145.2,
    "y": 62.8,
    "z": 171.4
  }
}
```

🌐 REST API Endpoints

🔹 Get all slots
```
GET /api/slots
```
🔹 Get free slots only
```
GET /api/slots/free
```
🔹 Get slot by ID
```
GET /api/slots/:id
```
🔹 Reserve a slot
```
POST /api/slots/:id/reserve
```

Body:
```
{
  "user_id": "user123",
  "duration": 10
}
```