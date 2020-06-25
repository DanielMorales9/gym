ALTER TABLE current_users_bundles rename to users_bundles;

INSERT INTO users_bundles (user_id, bundle_id)
SELECT user_id, bundle_id
FROM previous_users_bundles;

DROP TABLE previous_users_bundles;
