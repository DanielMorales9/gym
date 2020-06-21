ALTER TABLE events DROP COLUMN session_session_id;
ALTER TABLE events DROP COLUMN reservation_res_id;

ALTER TABLE reservations ADD COLUMN session_id bigint;

--- TODO add session constraint to table reservations
--- TODO add events constraint to table events
--- TODO add reservations constraint to table events
--- TODO transform events_sessions to reservations

DROP TABLE events_sessions;
