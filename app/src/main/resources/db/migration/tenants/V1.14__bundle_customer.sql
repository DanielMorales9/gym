ALTER TABLE bundles ADD COLUMN user_id bigint;

ALTER TABLE ONLY bundles
    ADD CONSTRAINT fk2o0jvgh89lemvvo17cbqvdxbb FOREIGN KEY (user_id) REFERENCES users(user_id);
