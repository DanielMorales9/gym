ALTER TABLE events ADD COLUMN max_customers int;

UPDATE events as e
SET max_customers = bs.max_customers
FROM bundle_specs as bs
WHERE e.spec_id is not null and bs.bundle_spec_id = e.spec_id;
