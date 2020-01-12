CREATE TABLE previous_users_bundles (
   user_id bigint NOT NULL,
   bundle_id bigint NOT NULL
);

ALTER TABLE previous_users_bundles OWNER TO goodfellas;

ALTER TABLE ONLY current_users_bundles
    ADD CONSTRAINT fkbdsx6pywcfesjltoew3rn7d6k FOREIGN KEY (bundle_id) REFERENCES bundles(bundle_id);
