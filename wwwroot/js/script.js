$(document).ready(function () {
    const rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 0;

    loadEmployees();
    loadDepartments();

    // Show the modal to add a new employee
    $('#btnAdd').click(function () {
        resetForm();
        $('#employeeModal').show();
    });

    // Hide the modal and reset form
    $('#btnCancel').click(function () {
        $('#employeeModal').hide();
        resetForm();
    });

    // Load employees from the server
    function loadEmployees() {
        $.get('/Employee/GetEmployeeList', function (employees) {
            totalPages = Math.ceil(employees.length / rowsPerPage);
            renderEmployees(employees, currentPage);
            renderPagination(totalPages);
        });
    }

    // Render employees based on the current page
    function renderEmployees(employees, page) {
        let start = (page - 1) * rowsPerPage;
        let end = start + rowsPerPage;
        let rows = '';
        let srno = start + 1;

        $.each(employees.slice(start, end), function (index, emp) {
            rows += '<tr>' +
                '<td>' + srno + '</td>' +
                '<td>' + emp.employeeName + '</td>' +
                '<td>' + emp.employeeGender + '</td>' +
                '<td>' + emp.employeeSalary + '</td>' +
                '<td>' + emp.departmentName + '</td>' +
                '<td>' +
                '<button class="btnEdit" data-id="' + emp.id + '">Edit</button>' +
                '<button class="btnDelete" data-id="' + emp.id + '">Delete</button>' +
                '</td>' +
                '</tr>';
            srno++;
        });

        $('#employeeTable tbody').html(rows);
    }

    // Render pagination controls
    function renderPagination(totalPages) {
        let paginationHtml = '';

        paginationHtml += `<button class="pagination-btn" data-page="prev">Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
        }
        paginationHtml += `<button class="pagination-btn" data-page="next">Next</button>`;
        $('#pagination').html(paginationHtml);
    }

    // Handle pagination button clicks
    $(document).on('click', '.pagination-btn', function () {
        let page = $(this).data('page');

        if (page === 'prev') {
            if (currentPage > 1) currentPage--;
        }
        else if (page === 'next') {
            if (currentPage < totalPages) currentPage++;
        }
        else {
            currentPage = parseInt(page);
        }

        loadEmployees();
    });

    // Load departments into the department dropdown
    function loadDepartments() {
        $.ajax({
            url: '/Department/getAllDepartments',
            type: 'GET',
            success: function (response) {
                if (response.success) {
                    $('#employeeDepartment').empty();
                    $.each(response.department, function (index, department) {
                        $('#employeeDepartment').append(
                            '<option value="' + department.departmentId + '">' + department.departmentName + '</option>'
                        );
                        console.log(department);
                    });
                } else {
                    alert(response.message);
                }
            }
        });
    }

    // Save employee (Insert or Update)
    $('#btnSave').click(function () {
        var id = $('#empID').val();
        var employee = {
            id: id ? id : 0,
            employeeName: $('#empName').val(),
            employeeGender: $('input[name="empGender"]:checked').val(),
            employeeSalary: $('#empSalary').val(),
            departmentID: $('#employeeDepartment').val()
        };

        if (id == 0) {
            // Add new employee (POST)
            $.post('/Employee/InsertEmployee', employee, function (response) {
                if (response.success) {
                    alert(response.message);
                    loadEmployees();
                    $('#employeeModal').hide();
                } else {
                    alert('Error: ' + response.message);
                }
            });
        } else {
            // Update existing employee (PUT)
            $.ajax({
                url: '/Employee/UpdateEmployee',
                type: 'PUT',
                data: employee,
                success: function (response) {
                    if (response.success) {
                        alert(response.message);
                        loadEmployees();
                        $('#employeeModal').hide();
                    } else {
                        alert('Error: ' + response.message);
                    }
                }
            });
        }
    });

    $(document).on('click', '.btnEdit', function () {
        var row = $(this).closest('tr');
        var id = $(this).data('id');
        var name = row.find('td:eq(1)').text();
        var gender = row.find('td:eq(2)').text();
        var salary = row.find('td:eq(3)').text();
        var departmentName = row.find('td:eq(4)').text();

        // Set the employee details in the form
        $('#empID').val(id);
        $('#empName').val(name);
        $('input[name="empGender"][value="' + gender + '"]').prop('checked', true);
        $('#empSalary').val(salary);

        // Fetch department ID using department name and set it in the dropdown
        var departmentId = getDepartmentId(departmentName);
        $('#employeeDepartment').val(departmentId);

        // Show the modal
        $('#employeeModal').show();
    });

    // Delete employee
    $(document).on('click', '.btnDelete', function () {
        if (confirm('Are you sure you want to delete this employee?')) {
            var id = $(this).data('id');
            $.ajax({
                url: '/Employee/DeleteEmployee?id=' + id,
                type: 'DELETE',
                success: function (response) {
                    if (response.success) {
                        alert(response.message);
                        loadEmployees();
                    } else {
                        alert('Error: ' + response.message);
                    }
                }
            });
        }
    });

    // Reset form fields
    function resetForm() {
        $('#empID').val(0);
        $('#empName').val('');
        $('#empGender').val('');
        $('#empSalary').val('');
        $('#empDepartment').val('');
    }

    function getDepartmentId(departmentName) {
        $.ajax({
            url: '/Department/getDepartmentId',
            type: 'GET',
            data: { departmentName: departmentName },
            success: function (response) {
                if (response.success) {
                    // Set the department ID in the dropdown
                    $('#employeeDepartment').val(response.departmentId);
                } else {
                    alert(response.message);
                }
            }
        });
    }
});
