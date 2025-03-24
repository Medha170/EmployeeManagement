$(document).ready(function () {
    let rowsPerPage = parseInt($('#rowsPerPage').val()) || 5;
    let totalPages = 0;
    let currentPage = 1;
    let employeesCache = [];
    let filter = 'all';
    let genderFilter = 'all';
    let departmentFilter = 'all';
    let searchValue = '';
    let totalEmployees = [];

    loadEmployees();
    loadDepartments();

    $('#btnAdd').on('click', function () {
        window.location.href = '/Employee/Form';
    });

    $('#search').on('input',function () {
        searchValue = $('#search').val();
        loadEmployees();
    });

    // Handle filter change event
    $('#employeeFilter').on('change', function () {
        filter = $(this).val();
        currentPage = 1;
        loadEmployees();
    });

    // Handle gender filter change event
    $('#genderFilter').on('change', function () {
        //$(this).attr('selected', true);
        genderFilter = $(this).val();
        console.log(genderFilter);
        currentPage = 1;
        loadEmployees();
    });

    // Handle department filter change event
    $('#departmentFilter').on('change', function () {
        departmentFilter = $(this).val();
        console.log(departmentFilter);
        currentPage = 1;
        loadEmployees();
    });

    // Handle rows per page change event
    $('#rowsPerPage').on('change', function () {
        rowsPerPage = parseInt($(this).val()) || 5;  // Always convert to integer
        console.log("Rows per page changed to:", rowsPerPage);
        currentPage = 1;
        loadEmployees();
    });

    // Load employees from the server based on the selected filter
    function loadEmployees() {
        const url = filter === 'active' ? '/Employee/GetActiveEmployeeList' : '/Employee/GetEmployeeList';

        $.get(url, function (employees, response) {
            if (employees) {
                console.log(employees);
                totalEmployees = employees;

                employees = employees.filter(emp => genderFilter === 'all' || emp.employeeGender === genderFilter);
                employees = employees.filter(emp => departmentFilter === 'all' || emp.departmentID == departmentFilter);

                if (searchValue !== '') {
                    let searchId = parseInt(searchValue);
                    if (searchId && searchId > 0 && searchId <= employees.length) {
                        employees = [employees[searchId - 1]];
                    } else if (searchValue) {
                        employees = employees.filter(emp => emp.employeeName.toLowerCase().startsWith(searchValue.toLowerCase()));
                    }
                    else {
                        alert(`Employee not found with value: ${searchValue}`);
                    }
                }

                employeesCache = employees;
                let maxRows = employeesCache.length;

                $('#rowsPerPage').attr('max', maxRows);

                totalPages = Math.ceil(employeesCache.length / rowsPerPage);  // Calculate total pages
                currentPage = Math.min(currentPage, totalPages) || 1; // Prevent out-of-range page numbers

                renderEmployees(currentPage);
                renderPagination();
                console.log("Loaded employees:", employeesCache.length, "Total Pages:", totalPages);
            } else {
                alert(`Error: ${response.message}`);
            }
        });
    }

    function renderEmployees(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        let rows = '';
        //let srno = start + 1;

        $.each(employeesCache.slice(start, end), function (index, emp) {
            rows += `
                <tr>
                    <td>${totalEmployees.indexOf(emp) + 1}</td>
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
            //srno++;
        });

        $('#employeeTable tbody').html(rows);
        $('#number').text(currentPage);  // Display the current page number
    }

    // Render pagination controls
    function renderPagination() {
        let paginationHtml = `<button class="pagination-btn" data-page="prev">Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
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

        renderEmployees(currentPage);
        renderPagination();
    });

    $(document).on('click', '.btnEdit', function () {
        const id = $(this).data('id');
        window.location.href = `/Employee/Form/${id}`;
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

    // Load departments into the department dropdown
    function loadDepartments() {
        $.get('/Department/getAllDepartments', function (response) {
            if (response.success) {
                //$('#departmentFilter').empty();
                $.each(response.department, function (index, department) {
                    $('#departmentFilter').append(
                        `<option value="${department.departmentId}">${department.departmentName}</option>`
                    );
                });
            } else {
                alert(`Error: ${response.message}`);
            }
        });
    }
});
