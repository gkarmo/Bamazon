CREATE DATABASE bamazon;

USE bamazaon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (200) NOT NULL,
    department_name VARCHAR (200) NOT NULL,
    price INT default 0,
    stock_quantity INT default 0,
    PRIMARY KEY (item_id) 
);
