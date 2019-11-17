--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 11.2

-- Started on 2019-07-28 19:15:40 CEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 16402)
-- Name: bundle_specs; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE bundle_specs (
                                     bundle_spec_type character varying(1) NOT NULL,
                                     bundle_spec_id bigint NOT NULL,
                                     description character varying(255) NOT NULL,
                                     is_disabled boolean NOT NULL,
                                     name character varying(255) NOT NULL,
                                     price double precision NOT NULL,
                                     num_sessions integer,
                                     createdat timestamp without time zone NOT NULL,
                                     end_time timestamp without time zone,
                                     max_customers integer,
                                     start_time timestamp without time zone
);


ALTER TABLE bundle_specs OWNER TO daniel;

--
-- TOC entry 210 (class 1259 OID 16492)
-- Name: bundle_specs_spec_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE bundle_specs_spec_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bundle_specs_spec_id_seq OWNER TO daniel;

--
-- TOC entry 197 (class 1259 OID 16410)
-- Name: bundles; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE bundles (
                                bundle_type character varying(1) NOT NULL,
                                bundle_id bigint NOT NULL,
                                description character varying(255),
                                is_expired boolean,
                                name character varying(255),
                                price double precision,
                                num_sessions integer,
                                bundle_spec_bundle_spec_id bigint,
                                end_time timestamp without time zone,
                                max_customers integer,
                                start_time timestamp without time zone,
                                createdat timestamp without time zone NOT NULL
);


ALTER TABLE bundles OWNER TO daniel;

--
-- TOC entry 211 (class 1259 OID 16494)
-- Name: bundles_bundle_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE bundles_bundle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bundles_bundle_id_seq OWNER TO daniel;

--
-- TOC entry 198 (class 1259 OID 16418)
-- Name: bundles_sessions; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE bundles_sessions (
                                         atraining_bundle_bundle_id bigint NOT NULL,
                                         sessions_session_id bigint NOT NULL
);


ALTER TABLE bundles_sessions OWNER TO daniel;

--
-- TOC entry 199 (class 1259 OID 16421)
-- Name: current_users_bundles; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE current_users_bundles (
                                              user_id bigint NOT NULL,
                                              bundle_id bigint NOT NULL
);


ALTER TABLE current_users_bundles OWNER TO daniel;

--
-- TOC entry 220 (class 1259 OID 16625)
-- Name: events; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE events (
                               type character varying(1) NOT NULL,
                               event_id bigint NOT NULL,
                               end_time timestamp without time zone,
                               name character varying(255),
                               start_time timestamp without time zone,
                               gym_id bigint,
                               session_session_id bigint,
                               reservation_res_id bigint,
                               user_id bigint
);


ALTER TABLE events OWNER TO daniel;

--
-- TOC entry 221 (class 1259 OID 16628)
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE events_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE events_event_id_seq OWNER TO daniel;

--
-- TOC entry 222 (class 1259 OID 16630)
-- Name: events_reservations; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE events_reservations (
                                            course_event_event_id bigint NOT NULL,
                                            reservations_res_id bigint NOT NULL
);


ALTER TABLE events_reservations OWNER TO daniel;

--
-- TOC entry 200 (class 1259 OID 16424)
-- Name: gym; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE gym (
                            gym_id bigint NOT NULL,
                            name character varying(255),
                            week_starts_on integer,
                            friday_end_hour integer,
                            friday_start_hour integer,
                            monday_end_hour integer,
                            monday_start_hour integer,
                            saturday_end_hour integer,
                            saturday_start_hour integer,
                            sunday_end_hour integer,
                            sunday_start_hour integer,
                            thursday_end_hour integer,
                            thursday_start_hour integer,
                            tuesday_end_hour integer,
                            tuesday_start_hour integer,
                            wednesday_end_hour integer,
                            wednesday_start_hour integer,
                            friday_open boolean DEFAULT false,
                            monday_open boolean DEFAULT false,
                            saturday_open boolean DEFAULT false,
                            sunday_open boolean DEFAULT false,
                            thursday_open boolean DEFAULT false,
                            tuesday_open boolean DEFAULT false,
                            wednesday_open boolean DEFAULT false,
                            createdat timestamp without time zone NOT NULL
);


ALTER TABLE gym OWNER TO daniel;

--
-- TOC entry 212 (class 1259 OID 16496)
-- Name: gym_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE gym_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gym_id_seq OWNER TO daniel;

--
-- TOC entry 201 (class 1259 OID 16432)
-- Name: reservations; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE reservations (
                                     res_id bigint NOT NULL,
                                     is_confirmed boolean,
                                     user_user_id bigint
);


ALTER TABLE reservations OWNER TO daniel;

--
-- TOC entry 213 (class 1259 OID 16498)
-- Name: reservations_res_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE reservations_res_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE reservations_res_id_seq OWNER TO daniel;

--
-- TOC entry 202 (class 1259 OID 16437)
-- Name: roles; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE roles (
                              role_id bigint NOT NULL,
                              name character varying(255) NOT NULL
);


ALTER TABLE roles OWNER TO daniel;

--
-- TOC entry 214 (class 1259 OID 16500)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE roles_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE roles_role_id_seq OWNER TO daniel;

--
-- TOC entry 203 (class 1259 OID 16442)
-- Name: sales; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE sales (
                              sale_id bigint NOT NULL,
                              amount_payed double precision,
                              createdat timestamp without time zone NOT NULL,
                              is_completed boolean NOT NULL,
                              is_payed boolean NOT NULL,
                              payed_date timestamp without time zone,
                              total_price double precision,
                              customer_user_id bigint,
                              gym_gym_id bigint
);


ALTER TABLE sales OWNER TO daniel;

--
-- TOC entry 204 (class 1259 OID 16447)
-- Name: sales_lines; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE sales_lines (
                                    line_id bigint NOT NULL,
                                    bundle_specification_bundle_spec_id bigint,
                                    training_bundle_bundle_id bigint
);


ALTER TABLE sales_lines OWNER TO daniel;

--
-- TOC entry 215 (class 1259 OID 16502)
-- Name: sales_lines_line_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE sales_lines_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sales_lines_line_id_seq OWNER TO daniel;

--
-- TOC entry 216 (class 1259 OID 16504)
-- Name: sales_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE sales_sale_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sales_sale_id_seq OWNER TO daniel;

--
-- TOC entry 205 (class 1259 OID 16452)
-- Name: sales_sales_line_items; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE sales_sales_line_items (
                                               sale_sale_id bigint NOT NULL,
                                               sales_line_items_line_id bigint NOT NULL
);


ALTER TABLE sales_sales_line_items OWNER TO daniel;

--
-- TOC entry 206 (class 1259 OID 16455)
-- Name: sessions; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE sessions (
                                 session_type character varying(1) NOT NULL,
                                 session_id bigint NOT NULL,
                                 end_time timestamp without time zone,
                                 is_completed boolean,
                                 start_time timestamp without time zone,
                                 training_bundle_bundle_id bigint
);


ALTER TABLE sessions OWNER TO daniel;

--
-- TOC entry 217 (class 1259 OID 16506)
-- Name: sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE sessions_session_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sessions_session_id_seq OWNER TO daniel;

--
-- TOC entry 207 (class 1259 OID 16468)
-- Name: users; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE users (
                              user_type character varying(1) NOT NULL,
                              user_id bigint NOT NULL,
                              createdat timestamp without time zone NOT NULL,
                              email character varying(255) NOT NULL,
                              firstname character varying(30) NOT NULL,
                              is_verified boolean NOT NULL,
                              last_name character varying(30) NOT NULL,
                              password character varying(255),
                              height integer,
                              weight integer,
                              gym_id bigint
);


ALTER TABLE users OWNER TO daniel;

--
-- TOC entry 208 (class 1259 OID 16476)
-- Name: users_roles; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE users_roles (
                                    user_id bigint NOT NULL,
                                    role_id bigint NOT NULL
);


ALTER TABLE users_roles OWNER TO daniel;

--
-- TOC entry 218 (class 1259 OID 16510)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_user_id_seq OWNER TO daniel;

--
-- TOC entry 209 (class 1259 OID 16479)
-- Name: verify_token; Type: TABLE; Schema: public; Owner: daniel
--

CREATE TABLE verify_token (
                                     token_id bigint NOT NULL,
                                     expiry_date timestamp without time zone,
                                     token character varying(255),
                                     user_id bigint NOT NULL
);


ALTER TABLE verify_token OWNER TO daniel;

--
-- TOC entry 219 (class 1259 OID 16512)
-- Name: verify_token_id_seq; Type: SEQUENCE; Schema: public; Owner: daniel
--

CREATE SEQUENCE verify_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE verify_token_id_seq OWNER TO daniel;

--
-- TOC entry 3756 (class 2606 OID 16409)
-- Name: bundle_specs bundle_specs_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY bundle_specs
    ADD CONSTRAINT bundle_specs_pkey PRIMARY KEY (bundle_spec_id);


--
-- TOC entry 3758 (class 2606 OID 16417)
-- Name: bundles bundles_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY bundles
    ADD CONSTRAINT bundles_pkey PRIMARY KEY (bundle_id);


--
-- TOC entry 3784 (class 2606 OID 16634)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);


--
-- TOC entry 3762 (class 2606 OID 16428)
-- Name: gym gym_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY gym
    ADD CONSTRAINT gym_pkey PRIMARY KEY (gym_id);


--
-- TOC entry 3764 (class 2606 OID 16436)
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (res_id);


--
-- TOC entry 3766 (class 2606 OID 16441)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 3770 (class 2606 OID 16451)
-- Name: sales_lines sales_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales_lines
    ADD CONSTRAINT sales_lines_pkey PRIMARY KEY (line_id);


--
-- TOC entry 3768 (class 2606 OID 16446)
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (sale_id);


--
-- TOC entry 3774 (class 2606 OID 16459)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- TOC entry 3776 (class 2606 OID 16489)
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- TOC entry 3760 (class 2606 OID 16485)
-- Name: bundles_sessions uk_alolgxs9i0abooa93k36rduar; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY bundles_sessions
    ADD CONSTRAINT uk_alolgxs9i0abooa93k36rduar UNIQUE (sessions_session_id);


--
-- TOC entry 3786 (class 2606 OID 16636)
-- Name: events_reservations uk_n5sphwjoyxhrt0s1wq22073x5; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY events_reservations
    ADD CONSTRAINT uk_n5sphwjoyxhrt0s1wq22073x5 UNIQUE (reservations_res_id);


--
-- TOC entry 3772 (class 2606 OID 16487)
-- Name: sales_sales_line_items uk_s02kwn9p76aguaf3ox1rlds9k; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales_sales_line_items
    ADD CONSTRAINT uk_s02kwn9p76aguaf3ox1rlds9k UNIQUE (sales_line_items_line_id);


--
-- TOC entry 3780 (class 2606 OID 16491)
-- Name: users_roles ukq3r1u8cne2rw2hkr899xuh7vj; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY users_roles
    ADD CONSTRAINT ukq3r1u8cne2rw2hkr899xuh7vj UNIQUE (user_id, role_id);


--
-- TOC entry 3778 (class 2606 OID 16475)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3782 (class 2606 OID 16483)
-- Name: verify_token verify_token_pkey; Type: CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY verify_token
    ADD CONSTRAINT verify_token_pkey PRIMARY KEY (token_id);


--
-- TOC entry 3802 (class 2606 OID 16604)
-- Name: users_roles fk2o0jvgh89lemvvo17cbqvdxaa; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY users_roles
    ADD CONSTRAINT fk2o0jvgh89lemvvo17cbqvdxaa FOREIGN KEY (user_id) REFERENCES users(user_id);


--
-- TOC entry 3799 (class 2606 OID 16584)
-- Name: sessions fk3f84j4c4233pia83ubsbwxneb; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT fk3f84j4c4233pia83ubsbwxneb FOREIGN KEY (training_bundle_bundle_id) REFERENCES bundles(bundle_id);


--
-- TOC entry 3803 (class 2606 OID 16609)
-- Name: verify_token fk46ew66rbycre4rp9pv9e7cc2o; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY verify_token
    ADD CONSTRAINT fk46ew66rbycre4rp9pv9e7cc2o FOREIGN KEY (user_id) REFERENCES users(user_id);


--
-- TOC entry 3797 (class 2606 OID 16574)
-- Name: sales_sales_line_items fk4j38eabdjs1fh23r2rwj05j5h; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales_sales_line_items
    ADD CONSTRAINT fk4j38eabdjs1fh23r2rwj05j5h FOREIGN KEY (sales_line_items_line_id) REFERENCES sales_lines(line_id);


--
-- TOC entry 3787 (class 2606 OID 16514)
-- Name: bundles fk4l5eahkspwcmovt4r4nhwuyet; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY bundles
    ADD CONSTRAINT fk4l5eahkspwcmovt4r4nhwuyet FOREIGN KEY (bundle_spec_bundle_spec_id) REFERENCES bundle_specs(bundle_spec_id);


--
-- TOC entry 3795 (class 2606 OID 16564)
-- Name: sales_lines fk59qbgxecsad0r3tw27sdb0u8c; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales_lines
    ADD CONSTRAINT fk59qbgxecsad0r3tw27sdb0u8c FOREIGN KEY (bundle_specification_bundle_spec_id) REFERENCES bundle_specs(bundle_spec_id);


--
-- TOC entry 3790 (class 2606 OID 16529)
-- Name: current_users_bundles fkbdsx6pywcfesjltoew3rn7d7j; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY current_users_bundles
    ADD CONSTRAINT fkbdsx6pywcfesjltoew3rn7d7j FOREIGN KEY (bundle_id) REFERENCES bundles(bundle_id);


--
-- TOC entry 3788 (class 2606 OID 16519)
-- Name: bundles_sessions fkc42lfp5ka1na8yx4wj8po29d8; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY bundles_sessions
    ADD CONSTRAINT fkc42lfp5ka1na8yx4wj8po29d8 FOREIGN KEY (sessions_session_id) REFERENCES sessions(session_id);


--
-- TOC entry 3801 (class 2606 OID 16599)
-- Name: users_roles fkj6m8fwv7oqv74fcehir1a9ffy; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY users_roles
    ADD CONSTRAINT fkj6m8fwv7oqv74fcehir1a9ffy FOREIGN KEY (role_id) REFERENCES roles(role_id);


--
-- TOC entry 3800 (class 2606 OID 16594)
-- Name: users fkj88949d0ybov2j0g2xhvoxmi7; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fkj88949d0ybov2j0g2xhvoxmi7 FOREIGN KEY (gym_id) REFERENCES gym(gym_id);


--
-- TOC entry 3804 (class 2606 OID 16637)
-- Name: events_reservations fkjwll74ipyt2uea892j7y89r4b; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY events_reservations
    ADD CONSTRAINT fkjwll74ipyt2uea892j7y89r4b FOREIGN KEY (reservations_res_id) REFERENCES reservations(res_id);


--
-- TOC entry 3789 (class 2606 OID 16524)
-- Name: bundles_sessions fkkqujw22610v4nvqrhfox9g2e1; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY bundles_sessions
    ADD CONSTRAINT fkkqujw22610v4nvqrhfox9g2e1 FOREIGN KEY (atraining_bundle_bundle_id) REFERENCES bundles(bundle_id);


--
-- TOC entry 3796 (class 2606 OID 16569)
-- Name: sales_lines fkoq3rb5ssvps2eghycc4ttq8w9; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales_lines
    ADD CONSTRAINT fkoq3rb5ssvps2eghycc4ttq8w9 FOREIGN KEY (training_bundle_bundle_id) REFERENCES bundles(bundle_id);


--
-- TOC entry 3791 (class 2606 OID 16534)
-- Name: current_users_bundles fkp4mcjftlfhgl9q4cd13gdk3oi; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY current_users_bundles
    ADD CONSTRAINT fkp4mcjftlfhgl9q4cd13gdk3oi FOREIGN KEY (user_id) REFERENCES users(user_id);


--
-- TOC entry 3798 (class 2606 OID 16579)
-- Name: sales_sales_line_items fkp8e6pkne2xuamdd4h6k0evopg; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales_sales_line_items
    ADD CONSTRAINT fkp8e6pkne2xuamdd4h6k0evopg FOREIGN KEY (sale_sale_id) REFERENCES sales(sale_id);


--
-- TOC entry 3793 (class 2606 OID 16559)
-- Name: sales fkqqx7636pm22r20b6wlbbnpe37; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fkqqx7636pm22r20b6wlbbnpe37 FOREIGN KEY (customer_user_id) REFERENCES users(user_id);


--
-- TOC entry 3794 (class 2606 OID 16647)
-- Name: sales fkrh7y4q7ny0ks7lly8u741wuab; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fkrh7y4q7ny0ks7lly8u741wuab FOREIGN KEY (gym_gym_id) REFERENCES gym(gym_id);


--
-- TOC entry 3792 (class 2606 OID 16549)
-- Name: reservations fkro5yt7p6cw65gk9voohayycj6; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY reservations
    ADD CONSTRAINT fkro5yt7p6cw65gk9voohayycj6 FOREIGN KEY (user_user_id) REFERENCES users(user_id);


--
-- TOC entry 3805 (class 2606 OID 16642)
-- Name: events_reservations fktgmo3pi1792fxcnkg59gd5l1x; Type: FK CONSTRAINT; Schema: public; Owner: daniel
--

ALTER TABLE ONLY events_reservations
    ADD CONSTRAINT fktgmo3pi1792fxcnkg59gd5l1x FOREIGN KEY (course_event_event_id) REFERENCES events(event_id);
