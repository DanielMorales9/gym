CREATE TABLE images (
    image_id bigint NOT NULL,
    name varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
    pic_byte bytea NOT NULL,
    user_id bigint NOT NULL
);

ALTER TABLE images OWNER TO goodfellas;

CREATE SEQUENCE image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE image_id_seq OWNER TO goodfellas;

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (image_id);

ALTER TABLE ONLY images
    ADD CONSTRAINT fk2o0jvgh89lemvvo17cbqvdybb FOREIGN KEY (user_id) REFERENCES users(user_id);

ALTER TABLE users ADD COLUMN gender bool;
