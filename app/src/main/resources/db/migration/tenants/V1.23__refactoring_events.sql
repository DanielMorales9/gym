ALTER TABLE reservations ADD COLUMN session_id bigint;

ALTER TABLE reservations ADD CONSTRAINT
    reservations_sessions_fk FOREIGN KEY (session_id)
        REFERENCES sessions(session_id);

ALTER TABLE reservations ADD CONSTRAINT
    reservations_events_fk FOREIGN KEY (event_id)
        REFERENCES events(event_id);

UPDATE reservations
SET session_id = es.session_id
FROM events_sessions as es
WHERE es.reservation_key = res_id;

UPDATE reservations
SET event_id = es.event_id
FROM events_sessions as es
WHERE es.reservation_key = res_id;

UPDATE reservations
SET event_id = e.event_id
FROM events as e
WHERE e.reservation_res_id = res_id;

UPDATE reservations
SET session_id = e.session_session_id
FROM events as e
WHERE e.reservation_res_id = res_id;

UPDATE events
SET spec_id = b.bundle_spec_bundle_spec_id
FROM sessions as s, bundles as b
WHERE spec_id is null and session_session_id = s.session_id and
      b.bundle_id = s.training_bundle_bundle_id;

ALTER TABLE events DROP COLUMN session_session_id;
ALTER TABLE events DROP COLUMN reservation_res_id;


DROP TABLE events_sessions;
