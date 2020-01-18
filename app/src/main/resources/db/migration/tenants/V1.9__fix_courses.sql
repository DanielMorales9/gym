CREATE TABLE options (
                          option_id bigint NOT NULL,
                          bundle_spec_id bigint,
                          price double precision NOT NULL,
                          number int NOT NULL,
                          created_at timestamp without time zone NOT NULL
);

ALTER TABLE options OWNER TO goodfellas;

CREATE SEQUENCE options_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE options_id_seq OWNER TO goodfellas;

ALTER TABLE ONLY options
    ADD CONSTRAINT options_pkey PRIMARY KEY (option_id);

CREATE TABLE bundle_specs_options (
                                  bundle_spec_id bigint NOT NULL,
                                  option_id bigint NOT NULL
);

ALTER TABLE bundle_specs_options OWNER TO goodfellas;

ALTER TABLE ONLY bundle_specs_options
    ADD CONSTRAINT fkc42lfp5ka1na8yx4wh6pw32w4 FOREIGN KEY (bundle_spec_id) REFERENCES bundle_specs(bundle_spec_id);

ALTER TABLE ONLY bundle_specs_options
    ADD CONSTRAINT fkc42lfp5ka1na8yx4wh7oq21e5 FOREIGN KEY (option_id) REFERENCES options(option_id);


ALTER TABLE bundle_specs ALTER COLUMN price DROP NOT NULL;
ALTER TABLE bundle_specs DROP COLUMN number;
ALTER TABLE bundles ADD COLUMN option_id bigint;
ALTER TABLE ONLY bundles
    ADD CONSTRAINT fkqqx7636pm22r20b6wlbbvyfs83 FOREIGN KEY (option_id) REFERENCES options(option_id);

