-- Preserve V1 UUID primary keys and existing rows. V1 item/user columns remain
-- available to the current application while the new features are implemented.
CREATE EXTENSION IF NOT EXISTS vector;

-- V1's UNIQUE(phone) already created an index. Preserve the account and post
-- rows, but prevent hard deletion from cascading into items.
DROP INDEX IF EXISTS idx_users_phone;
ALTER TABLE items DROP CONSTRAINT items_user_id_fkey;
ALTER TABLE items ADD CONSTRAINT items_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE items ALTER COLUMN status DROP DEFAULT;

-- Either email or phone can identify an account. Existing V1 phone accounts
-- remain valid, while new email-only accounts are possible.
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN address TEXT;
ALTER TABLE users ADD COLUMN notify_by_email BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN notify_by_push BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN preferred_language VARCHAR(10) NOT NULL DEFAULT 'vi';
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE users ADD CONSTRAINT chk_users_contact
    CHECK (NULLIF(btrim(email), '') IS NOT NULL OR NULLIF(btrim(phone), '') IS NOT NULL);
CREATE UNIQUE INDEX uq_users_email_ci ON users (lower(btrim(email)))
    WHERE NULLIF(btrim(email), '') IS NOT NULL;

-- Administrative codes are optional on legacy posts. A ward always belongs
-- to the selected province; province-only posts are allowed.
CREATE TABLE provinces (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(50)
);

CREATE TABLE wards (
    code VARCHAR(10) PRIMARY KEY,
    province_code VARCHAR(10) NOT NULL REFERENCES provinces(code),
    name VARCHAR(100) NOT NULL,
    center_lat DOUBLE PRECISION,
    center_lng DOUBLE PRECISION,
    CONSTRAINT uq_wards_code_province UNIQUE (code, province_code),
    CONSTRAINT chk_wards_coordinates CHECK (
        (center_lat IS NULL AND center_lng IS NULL) OR
        (center_lat IS NOT NULL AND center_lng IS NOT NULL AND
            center_lat BETWEEN -90 AND 90 AND center_lng BETWEEN -180 AND 180)
    )
);
CREATE INDEX idx_wards_province ON wards(province_code);

ALTER TABLE items ADD COLUMN item_condition VARCHAR(50);
ALTER TABLE items ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE items ADD COLUMN province_code VARCHAR(10) REFERENCES provinces(code);
ALTER TABLE items ADD COLUMN ward_code VARCHAR(10);
ALTER TABLE items ADD COLUMN address_detail TEXT;
ALTER TABLE items ADD COLUMN lat DOUBLE PRECISION;
ALTER TABLE items ADD COLUMN lng DOUBLE PRECISION;
ALTER TABLE items ADD COLUMN coordinate_source VARCHAR(20);
ALTER TABLE items ADD COLUMN clip_image_vector vector(512);
ALTER TABLE items ADD COLUMN clip_text_vector vector(512);
ALTER TABLE items ADD COLUMN hsv_color_vector vector(32);
ALTER TABLE items ADD COLUMN embedding_status VARCHAR(20) NOT NULL DEFAULT 'PENDING';
ALTER TABLE items ADD COLUMN embedding_model_version VARCHAR(100);
ALTER TABLE items ADD COLUMN embedding_updated_at TIMESTAMPTZ;
ALTER TABLE items ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(item_name, '') || ' ' || coalesce(description, '') || ' ' ||
        coalesce(additional_characteristics, ''))
) STORED;
ALTER TABLE items ADD CONSTRAINT fk_items_ward_province
    FOREIGN KEY (ward_code, province_code) REFERENCES wards(code, province_code);
ALTER TABLE items ADD CONSTRAINT chk_items_ward_needs_province
    CHECK (ward_code IS NULL OR province_code IS NOT NULL);
ALTER TABLE items ADD CONSTRAINT chk_items_coordinates CHECK (
    (lat IS NULL AND lng IS NULL AND coordinate_source IS NULL) OR
    (lat IS NOT NULL AND lng IS NOT NULL AND coordinate_source IS NOT NULL AND
        lat BETWEEN -90 AND 90 AND lng BETWEEN -180 AND 180 AND
        coordinate_source IN ('PIN', 'GEOCODED', 'WARD_CENTROID'))
);
ALTER TABLE items ADD CONSTRAINT chk_items_embedding_status
    CHECK (embedding_status IN ('PENDING', 'READY', 'FAILED'));
CREATE INDEX idx_items_province ON items(province_code);
CREATE INDEX idx_items_ward ON items(ward_code);
CREATE INDEX idx_items_lat_lng ON items(lat, lng) WHERE lat IS NOT NULL;
CREATE INDEX idx_items_search ON items USING gin(search_vector);
CREATE INDEX idx_items_clip_image ON items USING hnsw (clip_image_vector vector_cosine_ops)
    WHERE clip_image_vector IS NOT NULL;
CREATE INDEX idx_items_clip_text ON items USING hnsw (clip_text_vector vector_cosine_ops)
    WHERE clip_text_vector IS NOT NULL;

-- AI suggestions do not change the LOST/FOUND nature of a post.
CREATE TABLE item_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lost_item_id UUID NOT NULL REFERENCES items(id),
    found_item_id UUID NOT NULL REFERENCES items(id),
    image_score NUMERIC(6,5),
    text_score NUMERIC(6,5),
    color_score NUMERIC(6,5),
    location_score NUMERIC(6,5),
    time_score NUMERIC(6,5),
    final_score NUMERIC(6,5) NOT NULL,
    model_version VARCHAR(100) NOT NULL,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_item_matches_pair UNIQUE (lost_item_id, found_item_id),
    CONSTRAINT chk_item_matches_distinct CHECK (lost_item_id <> found_item_id),
    CONSTRAINT chk_item_matches_scores CHECK (
        (image_score IS NULL OR image_score BETWEEN 0 AND 1) AND
        (text_score IS NULL OR text_score BETWEEN 0 AND 1) AND
        (color_score IS NULL OR color_score BETWEEN 0 AND 1) AND
        (location_score IS NULL OR location_score BETWEEN 0 AND 1) AND
        (time_score IS NULL OR time_score BETWEEN 0 AND 1) AND
        final_score BETWEEN 0 AND 1
    )
);
CREATE INDEX idx_item_matches_found ON item_matches(found_item_id);
CREATE INDEX idx_item_matches_lost_score ON item_matches(lost_item_id, final_score DESC);

CREATE TABLE item_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES items(id),
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_item_status_history_item ON item_status_history(item_id, created_at);

CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    found_item_id UUID NOT NULL REFERENCES items(id),
    lost_item_id UUID REFERENCES items(id),
    claimer_id UUID NOT NULL REFERENCES users(id),
    identifying_details TEXT NOT NULL,
    additional_photo_url VARCHAR(500),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    preferred_meeting_time TIMESTAMPTZ,
    preferred_meeting_location VARCHAR(255),
    note TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'WAITING_FINDER_VERIFICATION',
    response_note TEXT,
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_claims_status CHECK (status IN (
        'WAITING_FINDER_VERIFICATION', 'REQUEST_MORE_INFO', 'APPROVED', 'REJECTED'
    )),
    CONSTRAINT chk_claims_distinct_items CHECK (lost_item_id IS NULL OR lost_item_id <> found_item_id)
);
CREATE INDEX idx_claims_found_status ON claims(found_item_id, status);
CREATE INDEX idx_claims_claimer ON claims(claimer_id, created_at DESC);
CREATE UNIQUE INDEX uq_claims_approved_found ON claims(found_item_id) WHERE status = 'APPROVED';

-- Each question and answer remains available without overwriting the original
-- identifying details or finder response note.
CREATE TABLE claim_exchanges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES claims(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_claim_exchanges_claim ON claim_exchanges(claim_id, created_at);

CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL UNIQUE REFERENCES claims(id),
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at TIMESTAMPTZ
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL REFERENCES chat_rooms(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_room_created ON messages(chat_room_id, created_at, id);

-- A handover is complete only after the other party confirms the proposal.
CREATE TABLE handovers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL UNIQUE REFERENCES claims(id),
    proposed_by UUID NOT NULL REFERENCES users(id),
    confirmed_by UUID REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PROPOSED',
    proposed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at TIMESTAMPTZ,
    CONSTRAINT chk_handovers_status CHECK (status IN ('PROPOSED', 'CONFIRMED', 'CANCELLED')),
    CONSTRAINT chk_handovers_other_party CHECK (confirmed_by IS NULL OR confirmed_by <> proposed_by),
    CONSTRAINT chk_handovers_confirmation CHECK (
        (status = 'CONFIRMED' AND confirmed_by IS NOT NULL AND confirmed_at IS NOT NULL) OR
        (status <> 'CONFIRMED' AND confirmed_at IS NULL)
    )
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    ref_type VARCHAR(30),
    ref_id UUID,
    content TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ,
    CONSTRAINT chk_notifications_reference CHECK ((ref_type IS NULL) = (ref_id IS NULL))
);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE NOT is_read;

-- Explicit nullable foreign keys avoid dangling polymorphic report targets.
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    target_user_id UUID REFERENCES users(id),
    target_item_id UUID REFERENCES items(id),
    target_claim_id UUID REFERENCES claims(id),
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    evidence_image_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    admin_note TEXT,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    CONSTRAINT chk_reports_one_target CHECK (
        num_nonnulls(target_user_id, target_item_id, target_claim_id) = 1
    ),
    CONSTRAINT chk_reports_status CHECK (status IN ('PENDING', 'RESOLVED', 'DISMISSED'))
);
CREATE INDEX idx_reports_status_created ON reports(status, created_at);
CREATE INDEX idx_reports_reporter ON reports(reporter_id, created_at DESC);

CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(30),
    target_id UUID,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_admin_logs_target CHECK ((target_type IS NULL) = (target_id IS NULL))
);
CREATE INDEX idx_admin_logs_admin_created ON admin_logs(admin_id, created_at DESC);

-- Guard the semantic relationships that ordinary foreign keys cannot express.
CREATE FUNCTION validate_item_match() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM items WHERE id = NEW.lost_item_id AND item_type = 'LOST') OR
       NOT EXISTS (SELECT 1 FROM items WHERE id = NEW.found_item_id AND item_type = 'FOUND') THEN
        RAISE EXCEPTION 'item_matches must link a LOST item to a FOUND item';
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_item_match BEFORE INSERT OR UPDATE ON item_matches
    FOR EACH ROW EXECUTE FUNCTION validate_item_match();

CREATE FUNCTION validate_claim_items() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM items WHERE id = NEW.found_item_id AND item_type = 'FOUND' AND user_id <> NEW.claimer_id) THEN
        RAISE EXCEPTION 'claim must target another user''s FOUND item';
    END IF;
    IF NEW.lost_item_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM items WHERE id = NEW.lost_item_id AND item_type = 'LOST' AND user_id = NEW.claimer_id
    ) THEN
        RAISE EXCEPTION 'linked LOST item must belong to claimer';
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_claim_items BEFORE INSERT OR UPDATE OF found_item_id, lost_item_id, claimer_id ON claims
    FOR EACH ROW EXECUTE FUNCTION validate_claim_items();

CREATE FUNCTION record_item_status_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO item_status_history (item_id, old_status, new_status)
        VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$;
CREATE TRIGGER trg_record_item_status_change AFTER UPDATE OF status ON items
    FOR EACH ROW EXECUTE FUNCTION record_item_status_change();
