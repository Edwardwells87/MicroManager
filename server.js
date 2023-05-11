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

async function viewAllRoles() {
  try {
    const query = `SELECT roles.title, roles.role_id, departments.department_name, roles.salary
    FROM roles
    JOIN departments ON roles.department_id = departments.department_id`,
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
    connection.query('SELECT title FROM Role', (err, results) => {
      if (err) { err('cant get the rolls') }
      else {
        // rolesArray will now be an array of string values--the titles of the roles
        rolesArray = results.map(result => results.title)
        console.log(`AYEEEEEEEEEEEEEEEEEEEEEEEEEEE its an array of results ${rolesArray}`)
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

        break;
      case 'View all employees':
        // Implement the prompt for viewing all employees
        break;
      case 'Add a department':
        await addDepartmentPrompt();
        break;
      case 'Add a role':
        // Implement the prompt for adding a role
        break;
      case 'Add an employee':
        await addANewPerson()
        break;
      case :
        // Implement the prompt for updating an employee's role
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