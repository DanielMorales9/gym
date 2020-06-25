CREATE TABLE bundle_state (
      bundle_state_id bigint NOT NULL,
      bundle_state_type character varying(1) NOT NULL,
      bundle_id bigint,
      date timestamp without time zone NOT NULL
);

ALTER TABLE bundle_state OWNER TO goodfellas;

CREATE SEQUENCE bundle_state_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE bundle_state_id_seq OWNER TO goodfellas;

ALTER TABLE ONLY bundle_state
    ADD CONSTRAINT bundle_state_pkey PRIMARY KEY (bundle_state_id);

ALTER TABLE ONLY bundle_state
    ADD CONSTRAINT fkqqx7636pm22r20b6wlbbnre70 FOREIGN KEY (bundle_id) REFERENCES bundles(bundle_id);

