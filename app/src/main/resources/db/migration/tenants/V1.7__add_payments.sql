CREATE TABLE payments (
                             payment_id bigint NOT NULL,
                             sale_id bigint,
                             amount double precision NOT NULL,
                             created_at timestamp without time zone NOT NULL
);

ALTER TABLE payments OWNER TO goodfellas;

CREATE SEQUENCE payment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE payment_id_seq OWNER TO goodfellas;

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);

ALTER TABLE ONLY payments
    ADD CONSTRAINT fkqqx7636pm22r20b6wlbbnre59 FOREIGN KEY (sale_id) REFERENCES sales(sale_id);

