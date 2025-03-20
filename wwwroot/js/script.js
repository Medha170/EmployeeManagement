$(document).ready(function () {
    const rowsPerPage = 5;
    let currentPage = 1;
    let totalPages = 0;
    let filter = 'all';
    let employeesCache = [];

    loadEmployees();
    loadDepartments();

    // Handle filter change event
    $('#employeeFilter').change(function () {
        filter = $(this).val();
        currentPage = 1;
        loadEmployees();
    });

    // Show the modal to add a new employee
    $('#btnAdd').click(function () {
        resetForm();
        $('#employeeModal').show();
    });

    // Hide the modal and reset form
    $('#btnCancel').click(function () {
        hideModal();
    });

    // Improved Hide Modal Function
    function hideModal() {
        $('#employeeModal').hide();
        resetForm();
    }

    // Load employees from the server based on the selected filter
    function loadEmployees() {
        const url = filter === 'active' ? '/Employee/GetActiveEmployeeList' : '/Employee/GetEmployeeList';

        $.get(url, function (employees, response) {
            if (employees) {
                employeesCache = employees;
                totalPages = Math.ceil(employeesCache.length / rowsPerPage);
                renderEmployees(employeesCache, currentPage);
                renderPagination(totalPages);
                //console.log(employeesCache);
                //console.log(employees);
            } else {
                alert(`Error: ${response.message}`);
            }
        });
    }

    // Render employees based on the current page
    function renderEmployees(employeesCache, page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        let rows = '';
        let srno = start + 1;

        $.each(employeesCache.slice(start, end), function (index, emp) {
            rows += `
                <tr>
                    <td>${srno}</td>
                    <td>${emp.employeeName}</td>
                    <td>${emp.employeeGender}</td>
                    <td>${emp.employeeSalary}</td>
                    <td>${emp.departmentName}</td>
                    <td>${emp.employeeActive ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="btnEdit" data-id="${emp.id}">Edit</button>
                        <button class="btnDelete" data-id="${emp.id}">Delete</button>
                    </td>
                </tr>`;
            srno++;
        });

        $('#employeeTable tbody').html(rows);
    }

    // Render pagination controls
    function renderPagination(totalPages) {
        let paginationHtml = `
            <button class="pagination-btn" data-page="prev">Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
        }
        paginationHtml += `<button class="pagination-btn" data-page="next">Next</button>`;
        $('#pagination').html(paginationHtml);
    }

    // Handle pagination button clicks
    $(document).on('click', '.pagination-btn', function () {
        const page = $(this).data('page');

        if (page === 'prev' && currentPage > 1) currentPage--;
        else if (page === 'next' && currentPage < totalPages) currentPage++;
        else if (!isNaN(page)) currentPage = parseInt(page);

        renderEmployees(employeesCache, currentPage);
    });

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

    // Save employee (Insert or Update)
    $('#btnSave').click(function () {
        const id = $('#empID').val();
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
                    loadEmployees();
                    hideModal();
                }
            },
            error: function (xhr) {
                alert(`Error: ${xhr.responseText}`);
            }
        });
    });

    // Edit Employee
    $(document).on('click', '.btnEdit', function () {
        const id = $(this).data('id');
        const employee = employeesCache.find(emp => emp.id === id);

        if (employee) {
            $('#empID').val(employee.id);
            $('#empName').val(employee.employeeName);
            $('input[name="empGender"][value="' + employee.employeeGender + '"]').prop('checked', true);
            $('#empSalary').val(employee.employeeSalary);
            $('#employeeDepartment').val(employee.departmentID);
            $('#empActive').prop('checked', employee.employeeActive);
            $('#employeeModal').show();
        }
    });

    // Delete Employee
    $(document).on('click', '.btnDelete', function () {
        if (confirm('Are you sure you want to delete this employee?')) {
            const id = $(this).data('id');

            $.ajax({
                url: `/Employee/DeleteEmployee?id=${id}`,
                type: 'DELETE',
                success: function (response) {
                    alert(response.message);
                    if (response.success) {
                        loadEmployees();
                    }
                },
                error: function (xhr) {
                    alert(`Error: ${xhr.responseText}`);
                }
            });
        }
    });

    // Reset form fields
    function resetForm() {
        $('#empID').val(0);
        $('#empName').val('');
        $('input[name="empGender"]').prop('checked', false);
        $('#empSalary').val('');
        $('#employeeDepartment').val('');
        $('#empActive').prop('checked', false);
    }
});
