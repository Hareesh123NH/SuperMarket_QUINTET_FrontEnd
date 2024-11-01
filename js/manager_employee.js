let employees = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Mike Johnson", email: "mike@example.com" }
];

function populateEmployees() {
    const tableBody = document.getElementById('employeesTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing entries
    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td><button class="remove-btn" onclick="removeEmployee(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function addEmployee(event) {
    event.preventDefault();
    const name = document.getElementById('employeeName').value;
    const email = document.getElementById('employeeEmail').value;
    employees.push({ name, email });
    populateEmployees();
    document.getElementById('addEmployeeForm').reset();
}

function removeEmployee(index) {
    employees.splice(index, 1); // Remove employee from the array
    populateEmployees(); // Refresh the table
}

function toggleAddEmployee() {
    const addEmployeeDiv = document.querySelector('.add-employee');
    addEmployeeDiv.style.display = addEmployeeDiv.style.display === 'none' ? 'block' : 'none';
}

// Populate the table on page load
window.onload = populateEmployees;
