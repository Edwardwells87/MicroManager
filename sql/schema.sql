DROP DATABASE IF EXISTS OfficeHr_db;
CREATE DATABASE OfficeHr_db;

USE OfficeHr_db;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  departmentName VARCHAR(30)
);

CREATE TABLE employees (
  id INT PRIMARY KEY, 
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  INDEX (role_id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE TABLE  roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  department_id INT,
  salary DECIMAL,
  FOREIGN KEY (department_id) REFERENCES department(id),
  FOREIGN KEY (id) REFERENCES employees(role_id)
);


-- // make a self reference ^^^