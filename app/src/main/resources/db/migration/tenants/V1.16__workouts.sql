CREATE TABLE workouts (
    workout_id bigint NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    tag1 text NOT NULL,
    tag2 text,
    tag3 text,
    is_template boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);

ALTER TABLE workouts OWNER TO goodfellas;

CREATE SEQUENCE workout_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE workout_id_seq OWNER TO goodfellas;

ALTER TABLE ONLY workouts
    ADD CONSTRAINT workout_pkey PRIMARY KEY (workout_id);

