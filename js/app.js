const STORAGE_KEY = 'employees';

function getEmployees() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}


function saveEmployees(employees) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}


function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}


function initCreatePage() {
    const form = document.getElementById('employeeForm');
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');

    
    if (editId) {
        loadEmployeeForEdit(editId);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const employee = {
            id: editId || generateId(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            department: document.getElementById('department').value,
            position: document.getElementById('position').value,
            salary: document.getElementById('salary').value
        };

        let employees = getEmployees();

        if (editId) {
            
            const index = employees.findIndex(emp => emp.id === editId);
            if (index !== -1) {
                employees[index] = employee;
            }
        } else {
           
            employees.push(employee);
        }

        saveEmployees(employees);
        
    
        alert(editId ? 'Employee updated successfully!' : 'Employee added successfully!');
        window.location.href = 'index.html';
    });
}


function loadEmployeeForEdit(id) {
    const employees = getEmployees();
    const employee = employees.find(emp => emp.id === id);

    if (employee) {
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-user-edit"></i> Edit Employee';
        document.getElementById('name').value = employee.name;
        document.getElementById('email').value = employee.email;
        document.getElementById('phone').value = employee.phone;
        document.getElementById('department').value = employee.department;
        document.getElementById('position').value = employee.position;
        document.getElementById('salary').value = employee.salary;
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Update Employee';
    }
}


function initListPage() {
    const searchInput = document.getElementById('searchInput');
    
    renderTable();
    updateStats();


    searchInput.addEventListener('input', (e) => {
        renderTable(e.target.value);
    });
}


function renderTable(searchTerm = '') {
    const employees = getEmployees();
    const tableBody = document.getElementById('employeeTableBody');
    const emptyState = document.getElementById('emptyState');
    const employeeTable = document.getElementById('employeeTable');

    
    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    if (filteredEmployees.length === 0) {
        emptyState.style.display = 'block';
        employeeTable.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    employeeTable.style.display = 'table';


    tableBody.innerHTML = filteredEmployees.map((emp, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${emp.name}</strong></td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td><span class="badge badge-${emp.department.toLowerCase()}">${emp.department}</span></td>
            <td>${emp.position}</td>
            <td>₹${Number(emp.salary).toLocaleString()}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editEmployee('${emp.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteEmployee('${emp.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}


function editEmployee(id) {
    window.location.href = `create.html?edit=${id}`;
}


function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        let employees = getEmployees();
        employees = employees.filter(emp => emp.id !== id);
        saveEmployees(employees);
        renderTable();
        updateStats();
    }
}


function updateStats() {
    const employees = getEmployees();
    const totalEmployees = document.getElementById('totalEmployees');
    const departments = document.getElementById('departments');

    if (totalEmployees) {
        totalEmployees.textContent = employees.length;
    }

    if (departments) {
        const uniqueDepts = new Set(employees.map(emp => emp.department));
        departments.textContent = uniqueDepts.size;
    }
}
