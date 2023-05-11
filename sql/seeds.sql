INSERT INTO department (id, departmentName)
VALUES (1, 'Billing'),
       (2, 'Support'),
       (3, 'Janitorial');

INSERT INTO roles (id, title, salary, department_id)
VALUES (1, 'paper pusher', 50000, 1),
       (2, 'team lead', 60000, 1),
       (11, 'customer rep', 34000, 2),
       (12, 'supervisor', 51000, 2),
       (21, 'bucket man', 35000, 3),
       (22, 'sanitations super', 36000, 3);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (123, 'greg', 'jones', '01', 226),
       (124, 'timmy', 'Fitsimmons', '01', 226),
       (125, 'josh', 'josherson', '01', 226),
       (226, 'jimbo', 'pulwaker', '02', 226),
       (1123, 'jason', 'smith', '11', 1225),
       (1124, 'jasper', 'lightfoot', '11', 1225),
       (1225, 'joey', 'butafuko', '12', 1225),
       (2123, 'josiah', 'johnsenheimer', '21', 2225),
       (2124, 'joseph', 'jorgenson', '21', 2225),
       (2225, 'jordey', 'jigglebottom', '22', 2225);
