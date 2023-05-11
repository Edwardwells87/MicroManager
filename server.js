const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Koolaid88!!!!',
  database: 'OfficeHr_db',
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the OfficeHr_db database.');
    startApp();
  }
});

// Prompt for the main menu
function mainMenuPrompt() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'menuOption',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    },
  ]);
}

// Function to execute an SQL query
function executeQuery(query, values = []) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Prompt for viewing all departments
async function viewAllDepartmentsPrompt() {
  try {
    const query = 'SELECT * FROM departments';
    const departments = await executeQuery(query);
    console.table(departments);
  } catch (error) {
    console.error('An error occurred while fetching departments:', error);
  }
}

async function viewAllRolesPrompt(){
  try {
    const query = `SELECT roles.title, roles.role_id, departments.departmentName, roles.salary
    FROM roles
    JOIN department ON roles.department_id = department.id`;
    const roles = await executeQuery(query);
    console.table(roles);
  } catch (error) {
    console.error('An error occurred while fetching roles:', error);
  }
}

async function addRolePrompt() {
  try {
    const departments = await executeQuery('SELECT * FROM department');
    const { title, salary, department_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the role:',
        choices: departments.map((department) => ({
          name: department.departmentName,
          value: department.id,
        })),
      },
    ]);

    const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
    await executeQuery(query, [title, salary, department_id]);
    console.log('Role added successfully!');
  } catch (error) {
    console.error('An error occurred while adding a role:', error);
  }
}

async function updateEmployeeRolePrompt() {
  try {
    const employees = await executeQuery('SELECT * FROM employees');
    const roles = await executeQuery('SELECT * FROM roles');
    const { employee_id, role_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);

    const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
    await executeQuery(query, [role_id, employee_id]);
    console.log('Employee role updated successfully!');
  } catch (error) {
    console.error('An error occurred while updating an employee role:', error);
  }
}

// Prompt for adding a department
async function addDepartmentPrompt() {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
      },
    ]);

    const query = 'INSERT INTO departments (name) VALUES (?)';
    const result = await executeQuery(query, [departmentName]);
    console.log('Department added successfully!');
  } catch (error) {
    console.error('An error occurred while adding a department:', error);
  }
}

//prompt for adding a person 
async function addANewPerson() {

  let rolesArray = [];

  try {
    connection.query('SELECT title FROM Roles', (err, results) => {
      if (err) { err('cant get the rolls') }
      else {
        rolesArray = results.map(result => result.title)
        console.log('AYEEEEEEEEEEEEEEEEEEEEEEEEEEE its an array of results' + rolesArray)
      }
    })

    const {firstName, lastName, roles, bossId} = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "what is this person's first name?",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "what is this person's last name?"
      },
      {
        type: 'list',
        name: 'roles',
        message: 'what role would you like to assign to this person?',
        choices: rolesArray
      },
      {
        type: 'list',
        name: 'hasBoss',
        message: 'Are they a manager?',
        choices: ['yes', 'no']
      },
      {
        type: 'number',
        name: 'bossId',
        message: 'Please enter the id of the employee\'s boss.',
        when: (answersHash) => {
          if(answersHash.hasBoss == 'yes') return true;
          return false;
        }
      }

    ])

    const query = `'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [${firstName}, ${lastName}, ${roles}, ${bossId}]`;
  } catch {

  }
}


async function viewAllEmployeesPrompt() {
  try {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.departmentName
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN department ON roles.department_id = department.id`;
    const employees = await executeQuery(query);
    console.table(employees);
  } catch (error) {
    console.error('An error occurred while fetching employees:', error);
  }
}


// Close the database connection when exiting the application
function exitApp() {
  connection.end();
}

// Main program loop
async function startApp() {
  let exit = false;
  while (!exit) {
    const { menuOption } = await mainMenuPrompt();

    switch (menuOption) {
      case 'View all departments':
        await viewAllDepartmentsPrompt();
        break;
      case 'View all roles':
 viewAllRolesPrompt()
        break;
      case 'View all employees':
       await viewAllEmployeesPrompt();
        break;
      case 'Add a department':
        await addDepartmentPrompt();
        break;
      case 'Add a role':
        await addRolePrompt();
        break;
      case 'Add an employee':
        await addANewPerson();
        break;
      case 'update an Employee role':
        await viewAllRolesPrompt();
        break;
      case 'Exit':
        exit = true;
        console.log('Exiting the application...');
        break;
      default:
        console.log('Invalid option. Please choose a valid menu option.');
    }
  }

  exitApp();
}