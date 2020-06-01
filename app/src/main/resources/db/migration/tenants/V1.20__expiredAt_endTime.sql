UPDATE bundles
SET end_time = expired_at
where end_time IS NOT NULL
