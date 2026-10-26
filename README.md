# Employee Management
An ASP.NET Core MVC application for viewing and maintaining employee records stored in Microsoft SQL Server. The employee list is rendered in the browser and uses JSON endpoints for loading, searching, and changing data.
## Features
- List employees and filter the list to active employees.
- Search employees using the application's search endpoint.
- Sort the current results by ID, name, gender, salary, department, active status, or deleted status.
- Paginate results and choose the number of rows displayed per page.
- Include deleted employees in the list when needed.
- Create and update employee records, including their department and active status.
- Delete an employee through the application.
- Load departments from SQL Server for the employee form.
## Technology
- .NET 8 / ASP.NET Core MVC with Razor views
- C#
- Microsoft SQL Server, accessed through `Microsoft.Data.SqlClient`
- jQuery for the list and form interactions
- Bootstrap assets included in `wwwroot/lib`
## Requirements
- .NET 8 SDK
- A reachable Microsoft SQL Server instance
- A database named `employee` (or an equivalent database selected in the connection string)
- The database objects described under [Database requirements](#database-requirements)
The repository does not include a SQL schema or initialization script. The application expects the database objects to be provisioned separately before it can load employee or department data.
## Getting started
1. Clone the repository and change to its directory:
   ```bash
   git clone https://github.com/Medha170/EmployeeManagement.git
   cd EmployeeManagement
   ```
2. Configure the SQL Server connection. For local development, use .NET User Secrets so credentials are not committed to `appsettings.json`:
   ```bash
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" \
     "Server=localhost;Database=employee;User Id=sa;Password=<your-password>;TrustServerCertificate=True"
   ```
   Replace the server, authentication settings, and database name to match your SQL Server setup. The application reads the `ConnectionStrings:DefaultConnection` setting. For other environments, provide it through configuration or the `ConnectionStrings__DefaultConnection` environment variable.
3. Restore and run the project:
   ```bash
   dotnet restore
   dotnet run
   ```
   The included `http` launch profile listens at `http://localhost:5034`; the `https` profile also provides `https://localhost:7275`. The default route opens the employee list. To run without a launch profile, set the `PORT` environment variable; the application defaults to port `8080`:
   ```bash
   PORT=8080 dotnet run --no-launch-profile
   ```
   In PowerShell, use `$env:PORT = "8080"` before running the command.
## Database requirements
The data-access layer calls the following SQL Server stored procedures:
| Stored procedure | Application usage |
| --- | --- |
| `manageEmployee5` | Lists employees; optionally filters by active status or deleted-record visibility; inserts, updates, and deletes records. |
| `searchEmployee` | Searches employees using the `@SearchTerm` parameter. |
| `manageDepartment` | Lists departments and looks up a department using `@Dep_Name`. |
Employee queries are expected to return columns named `emp_ID`, `emp_name`, `gender`, `isActive`, `emp_salary`, `dep_ID`, `dep_name`, and `isDeleted`. Department queries return `dep_ID` and `dep_name`.
The procedure parameters are inferred from the calls made by the application: `@showDeleted`, optional `@IsActive`, `@ID`, `@Employee_Name`, `@Employee_Gender`, `@Employee_Salary`, `@Department_ID`, and `@Dep_Name`. The search procedure accepts `@SearchTerm` and is expected to return employee rows in the same shape. Ensure the stored procedures' behavior and result columns match this contract.
## Application structure
```text
Controllers/       MVC pages and JSON actions
Models/            Employee/department models and SQL data-access classes
Views/             Razor views for the employee list and form
wwwroot/css/       Application styles
wwwroot/js/        jQuery behavior for employee lists and forms
Program.cs         Service registration, HTTP pipeline, and default route
appsettings.json   Application settings and the connection-string setting
```
`EmployeeController` serves the list and form pages and exposes employee JSON actions. `DepartmentController` provides department data for the form. `EmployeeDAL` and `DepartmentDAL` execute the SQL Server stored procedures. The initial route is `{controller=Employee}/{action=Index}/{id?}`.
## HTTP actions
The MVC actions are available under these routes:
| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/Employee/Index` | Employee list page |
| `GET` | `/Employee/Form` | Employee creation form |
| `GET` | `/Employee/Form/{id}` | Employee edit form |
| `GET` | `/Employee/GetEmployeeList?showDeleted={boolean}` | List employees |
| `GET` | `/Employee/GetActiveEmployeeList?showDeleted={boolean}` | List active employees |
| `GET` | `/Employee/SearchEmployee?searchTerm={term}` | Search employees |
| `POST` | `/Employee/InsertEmployee` | Create an employee |
| `PUT` | `/Employee/UpdateEmployee` | Update an employee |
| `DELETE` | `/Employee/DeleteEmployee?id={id}` | Delete an employee |
| `GET` | `/Department/getAllDepartments` | List departments |
| `GET` | `/Department/getDepartmentId?departmentName={name}` | Look up a department ID |
These actions return JSON and are primarily used by the included browser scripts.
## Configuration
`appsettings.json` contains logging and host settings plus a local SQL connection-string default. Override `ConnectionStrings:DefaultConnection` for your environment, and keep real credentials out of tracked files. ASP.NET Core configuration supports environment-variable overrides using double underscores, for example:
```text
ConnectionStrings__DefaultConnection=Server=<server>;Database=employee;User Id=<user>;Password=<password>;TrustServerCertificate=True
```
The application binds to `http://*:<PORT>` when `PORT` is set, or `http://*:8080` otherwise.
## Docker
The repository contains a `Dockerfile` and `docker-compose.yml`, but the current container setup is not ready to run as-is: the project targets .NET 8 while the Dockerfile uses a .NET 6 runtime image, the Dockerfile and Compose command refer to an `init.sql` file that is not included, and the Compose port mapping does not match the application's default `PORT` (`8080`). Review and align those files, provide a database initialization script or provision the database separately, and configure credentials securely before using the Docker setup.
## Tests
No automated test project is currently included. To verify that the application compiles:
```bash
dotnet build
```
