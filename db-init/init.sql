-- ============================================
-- 1. PARKING_SLOTS
-- ============================================
CREATE TABLE PARKING_SLOTS (
    slot_id     INT PRIMARY KEY,
    lat         FLOAT,
    lng         FLOAT,
    is_active   BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 2. SLOT_STATUS
-- Stores the *current* status of a slot
-- ============================================
CREATE TABLE SLOT_STATUS (
    slot_id     INT PRIMARY KEY,           -- 1-to-1 with parking_slots
    status      VARCHAR(50) NOT NULL,      -- e.g., free, occupied, reserved
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id     VARCHAR(100),              -- optional
    duration    INT,                       -- duration in minutes
    FOREIGN KEY (slot_id) REFERENCES PARKING_SLOTS(slot_id)
        ON DELETE CASCADE
);

-- ============================================
-- 3. STATUS_HISTORY
-- Stores *past state changes*
-- ============================================
CREATE TABLE STATUS_HISTORY (
    id          SERIAL PRIMARY KEY,          -- auto increment
    slot_id     INT NOT NULL,
    status      VARCHAR(50) NOT NULL,
    timestamp   TIMESTAMP NOT NULL DEFAULT NOW(),
    
    FOREIGN KEY (slot_id) REFERENCES PARKING_SLOTS(slot_id)
        ON DELETE CASCADE
);

INSERT INTO parking_slots (slot_id, lat, lng, is_active)
VALUES
  (1, 59.38185, 17.90381, TRUE),
  (2, 59.38189, 17.90393, TRUE),
  (3, 59.38192, 17.90370, TRUE);

-- docker exec -it parking-postgres psql -U postgres -d parkingdb