DROP TABLE events_reservations;
ALTER TABLE reservations
    ADD COLUMN event_id bigint;
ALTER TABLE ONLY reservations
    ADD CONSTRAINT fktgmo3pi1792fxcnkg59gd5l1x
        FOREIGN KEY (event_id) REFERENCES events (event_id);
ALTER TABLE events
    DROP COLUMN gym_id;
