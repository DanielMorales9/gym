DROP TABLE bundles_sessions;
DROP TABLE sales_sales_line_items;
ALTER TABLE sales_lines ADD COLUMN sale_id bigint;
ALTER TABLE ONLY sales_lines
    ADD CONSTRAINT fkqqx7636pm22r20b6wlbbnpe38 FOREIGN KEY (sale_id) REFERENCES sales(sale_id);
