ALTER TABLE options ADD COLUMN option_type varchar;
UPDATE options
SET option_type = 'T';

INSERT INTO options(option_id, bundle_spec_id, name, price, number, created_at, option_type)
SELECT nextval('options_id_seq'), b.bundle_spec_id, b.name, b.price, b.num_sessions, now(), 'B'
FROM bundle_specs as b
WHERE b.bundle_spec_type = 'P';

UPDATE bundles
SET option_id = p.option_id
FROM bundle_specs as bs join options as p
    on bs.bundle_spec_id = p.bundle_spec_id join bundles as b on b.bundle_spec_bundle_spec_id = bs.bundle_spec_id
WHERE bs.bundle_spec_type = 'P';

ALTER TABLE bundle_specs DROP COLUMN price;
ALTER TABLE bundle_specs DROP COLUMN num_sessions;
