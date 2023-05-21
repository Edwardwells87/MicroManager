DROP DATABASE IF EXISTS OfficeHr_db;
CREATE DATABASE OfficeHr_db;

USE OfficeHr_db;

CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  departmentName TEXT
);

CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  department_id INT,
  salary DECIMAL,
  FOREIGN KEY (department_id) 
  REFERENCES departments(id)
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL, 
  FOREIGN KEY (role_id)
  REFERENCES roles(id),
  manager_id INT 
);