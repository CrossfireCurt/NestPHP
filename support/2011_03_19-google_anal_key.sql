
ALTER TABLE users ADD COLUMN ga_token character varying;
ALTER TABLE users ADD COLUMN ga_token_status smallint NOT NULL DEFAULT 0;
