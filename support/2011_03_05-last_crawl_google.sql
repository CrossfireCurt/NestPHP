
CREATE TABLE crawl_history
(
  page_id bigint NOT NULL,
  date_crawl timestamp with time zone,
  date_recorded timestamp with time zone NOT NULL DEFAULT now(),
  crawl_type character varying NOT NULL,
  CONSTRAINT crawl_history_pk PRIMARY KEY (page_id, date_recorded, crawl_type),
  CONSTRAINT page_id_fk FOREIGN KEY (page_id)
      REFERENCES page (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT page_id_crawl_date_crawl_type UNIQUE (page_id, date_crawl, crawl_type)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE crawl_history OWNER TO postgres;
