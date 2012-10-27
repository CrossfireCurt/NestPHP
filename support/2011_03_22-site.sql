
CREATE SEQUENCE site_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE site_id_seq OWNER TO postgres;

CREATE TABLE site
(
   id bigint NOT NULL DEFAULT nextval('site_id_seq'::regclass), 
   "name" character varying, 
   base_url character varying NOT NULL, 
   "desc" text, 
   CONSTRAINT pk_site_id PRIMARY KEY (id)
) 
WITH (
  OIDS = FALSE
)
;

ALTER TABLE site ADD COLUMN is_deleted bigint NOT NULL DEFAULT 0;


CREATE TABLE users_site
(
  user_id bigint NOT NULL,
  site_id bigint NOT NULL,
  is_deleted smallint NOT NULL DEFAULT 0,
  CONSTRAINT users_site_pk PRIMARY KEY (user_id, site_id),
  CONSTRAINT users_site_site_id_fk FOREIGN KEY (site_id)
      REFERENCES site (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT users_site_user_id_fk FOREIGN KEY (user_id)
      REFERENCES users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users_site OWNER TO postgres;

delete from users_page;
delete from crawl_history;
drop table users_page;
delete from page;

ALTER TABLE page ADD COLUMN site_id bigint NOT NULL;
ALTER TABLE page ADD CONSTRAINT site_id_fk FOREIGN KEY (site_id) REFERENCES site (id) ON UPDATE NO ACTION ON DELETE NO ACTION;