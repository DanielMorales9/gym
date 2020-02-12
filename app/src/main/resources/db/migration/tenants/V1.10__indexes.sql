-- primary indexes
CREATE INDEX bundle_specs_index_id ON bundle_specs(bundle_spec_id);
CREATE INDEX bundles_index_id ON bundles(bundle_id);
CREATE INDEX events_index_id ON events(event_id);
CREATE INDEX gym_index_id ON gym(gym_id);
CREATE INDEX reservations_index_id ON reservations(res_id);
CREATE INDEX roles_index_id ON roles(role_id);
CREATE INDEX sales_index_id ON sales(sale_id);
CREATE INDEX sessions_index_id ON sessions(session_id);
CREATE INDEX users_index_id ON users(user_id);
CREATE INDEX payments_index_id ON payments(payment_id);

-- secondary indexes
CREATE INDEX event_index_time ON events(start_time, end_time);
CREATE INDEX user_index_last_name ON users(last_name);
CREATE INDEX user_index_email ON users(email);
CREATE INDEX verify_index_token ON verify_token(token);
CREATE INDEX sales_index_created_at ON sales(createdat);

-- join indexes
CREATE INDEX options_index_index_id ON options(bundle_spec_id);
CREATE INDEX sales_lines_index_id ON sales_lines(sale_id);
CREATE INDEX users_roles_index_id ON users_roles(user_id);
CREATE INDEX events_sessions_index_id ON events_sessions(event_id);
CREATE INDEX previous_users_bundles_index_id ON previous_users_bundles(user_id);
CREATE INDEX current_users_bundles_index_id ON current_users_bundles(user_id);

