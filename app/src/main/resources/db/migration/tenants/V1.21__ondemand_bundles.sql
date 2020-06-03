ALTER TABLE events ADD COLUMN is_external bool NULL;

UPDATE events
SET is_external = false
where events.is_external IS NULL
