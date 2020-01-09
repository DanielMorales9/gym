ALTER TABLE bundles DROP COLUMN description;
ALTER TABLE bundles DROP COLUMN price;
ALTER TABLE bundles DROP COLUMN max_customers;
ALTER TABLE bundles DROP COLUMN num_sessions;
ALTER TABLE bundle_specs DROP COLUMN start_time;
ALTER TABLE bundle_specs DROP COLUMN end_time;
ALTER TABLE bundle_specs ADD COLUMN number int;
