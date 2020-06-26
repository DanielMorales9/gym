DROP TABLE users_bundles;
ALTER TABLE reservations DROP CONSTRAINT fktgmo3pi1792fxcnkg59gd5l1x;

ALTER TABLE bundles RENAME COLUMN bundle_spec_bundle_spec_id TO spec_id;
ALTER TABLE options RENAME COLUMN bundle_spec_id TO spec_id;
ALTER TABLE bundles RENAME COLUMN createdat TO created_at;
ALTER TABLE bundle_specs RENAME COLUMN createdat TO created_at;
ALTER TABLE gym RENAME COLUMN createdat TO created_at;
ALTER TABLE sales RENAME COLUMN createdat TO created_at;
ALTER TABLE reservations RENAME COLUMN user_user_id TO user_id;
ALTER TABLE users RENAME COLUMN createdat TO created_at;
ALTER TABLE users RENAME COLUMN last_name TO lastname;
ALTER TABLE sales RENAME COLUMN customer_user_id TO user_id;
ALTER TABLE sales_lines RENAME COLUMN bundle_specification_bundle_spec_id TO spec_id;
ALTER TABLE sales_lines RENAME COLUMN training_bundle_bundle_id TO bundle_id;
ALTER TABLE sessions RENAME COLUMN training_bundle_bundle_id TO bundle_id;
