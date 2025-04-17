// Problem 1: Create JSON for each employee
const employees = [
    { firstName: 'Sam', department: 'Tech', designation: 'Manager', salary: 40000, raiseEligible: true },
    { firstName: 'Mary', department: 'Finance', designation: 'Trainee', salary: 18500, raiseEligible: true },
    { firstName: 'Bill', department: 'HR', designation: 'Executive', salary: 21200, raiseEligible: false }
  ];
  
  console.log("// Problem 1");
  console.log(employees);
  
  // Problem 2: Create company JSON
  const company = {
    companyName: 'Tech Stars',
    website: 'www.techstars.site',
    employees: employees
  };
  
  console.log("// Problem 2");
  console.log(company);
  
  // Problem 3: Add new employee Anna
  const newEmployee = { firstName: 'Anna', department: 'Tech', designation: 'Executive', salary: 25600, raiseEligible: false };
  company.employees.push(newEmployee);
  
  console.log("// Problem 3");
  console.log(company);
  
  // Problem 4: Calculate total salary
  let totalSalary = 0;
  for (let emp of company.employees) {
    totalSalary += emp.salary;
  }
  
  console.log("// Problem 4");
  console.log("Total Salary: $" + totalSalary);
  
  // Problem 5: Give raises
  function applyRaises(company) {
    for (let emp of company.employees) {
      if (emp.raiseEligible) {
        emp.salary *= 1.10;
        emp.raiseEligible = false;
      }
    }
  }
  
  applyRaises(company);
  
  console.log("// Problem 5");
  console.log(company);
  
  // Problem 6: Work from home update
  const workingFromHome = ['Anna', 'Sam'];
  for (let emp of company.employees) {
    emp.wfh = workingFromHome.includes(emp.firstName);
  }
  
  console.log("// Problem 6");
  console.log(company);
  