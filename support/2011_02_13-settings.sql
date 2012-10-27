DROP TABLE "configuration";

CREATE TABLE settings
(
  id bigint NOT NULL,
  param_name character varying NOT NULL,
  param_value character varying NOT NULL,
  CONSTRAINT configuration_id_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE settings OWNER TO postgres;

insert into settings VALUES(1, 'app_name', 'project titan');