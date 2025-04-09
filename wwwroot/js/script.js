$(document).ready(function () { 
    let rowsPerPage = parseInt($('#rowsPerPage').val()) || 5;
    let totalPages = 0;
    let currentPage = 1;
    let employeesCache = [];
    let filter = 'all';
    let searchValue = '';
    let searchCache = [];
    let showDeleted = false;

    $('#deleted').on('change', function () {
        showDeleted = $(this).prop('checked');
        loadEmployees();
    }); 

    loadEmployees();

    $('#btnAdd').on('click', function () {
        window.location.href = '/Employee/Form';
    });

    $('#search').on('input', function () {
        searchValue = $(this).val().trim();
        searchEmployees();
    });

    $('#btnSearch').on('click', function () {
        if (searchCache.length === 0) {
            alert("No Employees found");
            $('#search').val('');
            searchValue = '';
            searchCache = [];
            loadEmployees();  // Reset table
        }
    });

    // Handle filter change event
    $('#employeeFilter').on('change', function () {
        filter = $(this).val();
        currentPage = 1;
        loadEmployees();
    });

    // Handle rows per page change event
    $('#rowsPerPage').on('change', function () {
        rowsPerPage = parseInt($(this).val()) || 5;  // Always convert to integer
        currentPage = 1;
        loadEmployees();
    });

    $(".sort-up, .sort-down").on('click', function () {
        const column = $(this).data('column');
        const order = $(this).hasClass('sort-up') ? 'asc' : 'desc';

        let cache = searchCache.length > 0 ? searchCache : employeesCache;
        applySorting(cache, column, order);

        // Re-render table from first page after sorting
        renderEmployees(cache, 1);
        renderPagination();
    });

    function applySorting(cache, column, order) {
        cache.sort((a, b) => {
            if (column === 'ID') {
                return order === 'asc' ? a.id - b.id : b.id - a.id;
            }

            if (column === 'Name') {
                return order === 'asc' ? a.employeeName.localeCompare(b.employeeName) : b.employeeName.localeCompare(a.employeeName);
            }

            if (column === 'Gender') {
                return order === 'asc' ? a.employeeGender.localeCompare(b.employeeGender) : b.employeeGender.localeCompare(a.employeeGender);
            }

            if (column === 'Salary') {
                return order === 'asc' ? a.employeeSalary - b.employeeSalary : b.employeeSalary - a.employeeSalary;
            }

            if (column === 'Department') {
                return order === 'asc' ? a.departmentName.localeCompare(b.departmentName) : b.departmentName.localeCompare(a.departmentName);
            }

            if (column === 'Active') {
                return order === 'asc' ? a.employeeActive - b.employeeActive : b.employeeActive - a.employeeActive;
            }

            if (column === 'isDeleted') {
                return order === 'asc' ? a.employeeDeleted - b.employeeDeleted : b.employeeDeleted - a.employeeDeleted;
            }

            return 0;
        });
    }

    function searchEmployees() {
        if (searchValue.trim() !== '') {
            $.get(`/Employee/SearchEmployee?searchTerm=${encodeURIComponent(searchValue)}`, function (employees, response) {
                if (employees.length > 0) {
                    searchCache = employees;
                } else {
                    searchCache = [];  // Clear the search cache
                }
                updateTable();
            }).fail(function () {
                alert("Error retrieving search results.");
            });
        } else {
            // If search is empty, clear results and reset table
            searchCache = [];
            //updateTable();
            loadEmployees();
        }
    }

    function updateTable() {
        if (searchCache.length > 0) {
            totalPages = Math.ceil(searchCache.length / rowsPerPage)
            renderEmployees(searchCache, 1);
        } else {
            totalPages = 1;
            $('#employeeTable tbody').empty(); // Clear the table if no results
        }
        renderPagination();
    }

    // Load employees from the server based on the selected filter
    function loadEmployees() {
        const url = filter === 'active' ? `/Employee/GetActiveEmployeeList?showDeleted=${encodeURIComponent(showDeleted)}` : `/Employee/GetEmployeeList?showDeleted=${encodeURIComponent(showDeleted)}`;

        $.get(url, function (employees, response) {
            if (employees) {

                employeesCache = employees;
                let maxRows = employeesCache.length;

                $('#rowsPerPage').attr('max', maxRows);

                totalPages = Math.ceil(employeesCache.length / rowsPerPage);  // Calculate total pages
                currentPage = Math.min(currentPage, totalPages) || 1; // Prevent out-of-range page numbers

                renderEmployees(employeesCache, currentPage);
                renderPagination();
            } else {
                alert(`Error: ${response.message}`);
            }
        }).fail(function () {
            alert("Error loading employees.");
        });
    }

    function renderEmployees(cache,page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        let rows = '';

        $.each(cache.slice(start, end), function (index, emp) {
            rows += `
                <tr>
                    <td>${start + index + 1}</td>
                    <td>${emp.id}</td>
                    <td><a href="/Employee/Form/${emp.id}" style="text-decoration: none; color: black;">${emp.employeeName}</a></td>
                    <td>${emp.employeeGender}</td>
                    <td>${emp.employeeSalary}</td>
                    <td>${emp.departmentName}</td>
                    <td>${emp.employeeActive ? 'Yes' : 'No'}</td>
                    <td>${emp.employeeDeleted ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="btnEdit" data-id="${emp.id}">Edit</button>
                        <button class="btnDelete" data-id="${emp.id}">Delete</button>
                    </td>
                </tr>`;
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

        let cache = searchCache.length === 0 ? employeesCache : searchCache;

        renderEmployees(cache, currentPage);
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
});
