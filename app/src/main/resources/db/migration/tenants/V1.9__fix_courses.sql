CREATE TABLE options (
                          option_id bigint NOT NULL,
                          bundle_spec_id bigint,
                          price double precision NOT NULL,
                          number int NOT NULL,
                          created_at timestamp without time zone NOT NULL
);

ALTER TABLE options OWNER TO goodfellas;

CREATE SEQUENCE option_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE option_id_seq OWNER TO goodfellas;

ALTER TABLE ONLY options
    ADD CONSTRAINT options_pkey PRIMARY KEY (option_id);

ALTER TABLE ONLY options
    ADD CONSTRAINT fkqqx7636pm22r20b6wlbbryq71 FOREIGN KEY (bundle_spec_id) REFERENCES bundle_specs(bundle_spec_id);
