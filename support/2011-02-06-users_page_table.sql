
delete from page;
ALTER TABLE page ADD COLUMN is_deleted smallint NOT NULL DEFAULT 0;

CREATE TABLE users_page
(
  user_id bigint NOT NULL,
  page_id bigint NOT NULL,
  is_deleted smallint NOT NULL DEFAULT 0,
  CONSTRAINT users_page_pk PRIMARY KEY (user_id, page_id),
  CONSTRAINT users_page_page_id_fk FOREIGN KEY (page_id)
      REFERENCES page (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT users_page_user_id_fk FOREIGN KEY (user_id)
      REFERENCES users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users_page OWNER TO postgres;

