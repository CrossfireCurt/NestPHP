
CREATE SEQUENCE user_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE user_id_seq OWNER TO postgres;


CREATE TABLE users
(
  id bigint NOT NULL DEFAULT nextval('user_id_seq'::regclass),
  username character varying NOT NULL,
  email character varying NOT NULL,
  password character varying NOT NULL,
  is_deleted smallint NOT NULL,
  CONSTRAINT user_id_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE page OWNER TO postgres;