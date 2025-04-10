$(document).ready(function () {
    let employeesCache = [];

    loadEmployee();
    loadDepartments();

    const path = window.location.pathname;
    console.log("Page path is: ", path);
    const segments = path.split("/");

    let empID = segments[segments.length - 1];

    // Use parseInt and validate it
    empID = isNaN(parseInt(empID)) ? 0 : parseInt(empID);
    console.log("Employee ID:", empID);

    // Set the header text based on edit or create mode
    if (empID > 0) {
        $('h2').text("Edit Employee");
    } else {
        $('h2').text("Create Employee");
    }

    // Find the employee from the cache and pre-fill form if editing
    let employee = employeesCache.find(emp => emp.id === empID);

    if (employee) {
        $('#empID').val(employee.id);
        $('#empName').val(employee.employeeName);
        $('input[name="empGender"][value="' + employee.employeeGender + '"]').prop('checked', true);
        $('#empSalary').val(employee.employeeSalary);
        $('#employeeDepartment').val(employee.departmentID);
        $('#empActive').prop('checked', employee.employeeActive);
    }

    $('#btnSave').click(function (event) {
        event.preventDefault();

        const id = empID;
        const employee = {
            id: id ? id : 0,
            employeeName: $('#empName').val(),
            employeeGender: $('input[name="empGender"]:checked').val(),
            employeeSalary: $('#empSalary').val(),
            departmentID: $('#employeeDepartment').val(),
            employeeActive: $('#empActive').is(':checked')
        };

        const url = id == 0 ? '/Employee/InsertEmployee' : '/Employee/UpdateEmployee';
        const method = id == 0 ? 'POST' : 'PUT';

        $.ajax({
            url: url,
            type: method,
            data: employee,
            success: function (response) {
                alert(response.message);
                if (response.success) {
                    loadEmployee();
                    window.location.href = '/Employee/Index'
                }
            },
            error: function (xhr) {
                alert(`Error: ${xhr.responseText}`);
            }
        });
    });

    $('#btnCancel').click(function (event) {
        event.preventDefault();
        window.location.href = '/Employee/Index';
    });

    function loadEmployee() {
        const url = '/Employee/GetEmployeeList';

        $.get(url, function (employees, response) {
            if (employees) {
                employeesCache = employees;

                // If editing, load employee data after cache is filled
                if (empID > 0) {
                    let employee = employeesCache.find(emp => emp.id === empID);
                    if (employee) {
                        $('#empID').val(employee.id);
                        $('#empName').val(employee.employeeName);
                        $('input[name="empGender"][value="' + employee.employeeGender + '"]').prop('checked', true);
                        $('#empSalary').val(employee.employeeSalary);
                        $('#employeeDepartment').val(employee.departmentID);
                        $('#empActive').prop('checked', employee.employeeActive);
                    }
                }
            } else {
                alert(`Error: ${response.message}`);
            }
        });
    }

    // Load departments into the department dropdown
    function loadDepartments() {
        $.get('/Department/getAllDepartments', function (response) {
            if (response.success) {
                $('#employeeDepartment').empty();
                $.each(response.department, function (index, department) {
                    $('#employeeDepartment').append(
                        `<option value="${department.departmentId}">${department.departmentName}</option>`
                    );
                });
            } else {
                alert(`Error: ${response.message}`);
            }
        });
    }
});
