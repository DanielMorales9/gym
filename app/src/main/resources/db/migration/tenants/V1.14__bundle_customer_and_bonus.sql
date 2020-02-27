ALTER TABLE bundles ADD COLUMN unlimited_deletions bool DEFAULT true;
ALTER TABLE bundles ADD COLUMN n_deletions int;
ALTER TABLE bundle_specs ADD COLUMN unlimited_deletions bool DEFAULT true;
ALTER TABLE bundle_specs ADD COLUMN n_deletions int;

UPDATE bundles SET unlimited_deletions = true WHERE bundles.unlimited_deletions IS NULL;
UPDATE bundle_specs SET unlimited_deletions = true WHERE bundle_specs.unlimited_deletions IS NULL;

ALTER TABLE bundles ALTER COLUMN unlimited_deletions SET NOT NULL;
ALTER TABLE bundle_specs ALTER COLUMN unlimited_deletions SET NOT NULL;

ALTER TABLE bundles ADD COLUMN user_id bigint;

ALTER TABLE ONLY bundles
    ADD CONSTRAINT fk2o0jvgh89lemvvo17cbqvdxbb FOREIGN KEY (user_id) REFERENCES users(user_id);
