ALTER TABLE workouts ADD COLUMN session_id bigint;
ALTER TABLE ONLY workouts
    ADD CONSTRAINT fkqqx7636pm22r20b6wlyyrfi96 FOREIGN KEY (session_id) REFERENCES sessions(session_id);

