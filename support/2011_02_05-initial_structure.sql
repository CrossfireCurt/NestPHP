CREATE SEQUENCE page_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE page_id_seq OWNER TO postgres;

CREATE TABLE "configuration"
(
  id bigint NOT NULL,
  param_name character varying NOT NULL,
  param_value character varying NOT NULL,
  CONSTRAINT configuration_id_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "configuration" OWNER TO postgres;

CREATE TABLE page
(
  id bigint NOT NULL DEFAULT nextval('page_id_seq'::regclass),
  url character varying,
  title character varying,
  keywords character varying,
  description character varying,
  CONSTRAINT page_id_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE page OWNER TO postgres;