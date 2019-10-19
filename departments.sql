CREATE TABLE departments(
	department_id INT NOT NULL,
    department_name VARCHAR(100),
    over_head_costs DECIMAL(6,2),
    product_sales DECIMAL(6,2)
);


INSERT INTO bamazon_db.departments (department_id, department_name, over_head_costs, product_sales)
VALUES (4000, "accessories", 250, 100),
(2000, "edible", 300, 500),
(1000, "indoor plant", 500, 1000),
(3000, "tree", 400, 2000),
(5000, "seeds", 300, 2500);