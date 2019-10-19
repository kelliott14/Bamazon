CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(5,2),
	stock_quantity INTEGER
);


INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1001,"aloe vera", "indoor plant", 25, 17),
		(1002,"monstera", "indoor plant", 55, 4),
        (1003,"snake plant", "indoor plant", 20, 15),
        (1004,"rubber tree", "indoor plant", 60, 5),
        (1005,"pothos", "indoor plant", 15, 20),
        (2001,"lemon tree", "edible", 60, 8),
        (3001,"frangipani", "tree", 40, 10),
        (3002,"lilly pilly", "tree", 35, 15),
		(2002,"strawberry bush", "edible", 20, 2),
        (3003,"dragon tree", "tree", 80, 5),
        (4001,"gloves", "accessories", 8, 70),
        (4002,"small spade", "accessories", 15, 80);