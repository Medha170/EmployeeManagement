using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeManagementNew.Models
{
    public class EmployeeDAL
    {
        private readonly string connectionString;

        public EmployeeDAL(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        int result = 0;

        bool searchCalled = false;

        public List<Employee> SearchEmployee(string searchTerm)
        {
            List<Employee> employees = new List<Employee>();

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("searchEmployee", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@SearchTerm", string.IsNullOrEmpty(searchTerm) ? (object)DBNull.Value : searchTerm);

                // Return parameter for checking success/failure
                SqlParameter returnParam = new SqlParameter("@ReturnValue", SqlDbType.Int);
                returnParam.Direction = ParameterDirection.ReturnValue;
                cmd.Parameters.Add(returnParam);

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();

                // Read employees if the stored procedure returns valid data
                while (rdr.Read())
                {
                    Employee emp = new Employee
                    {
                        ID = Convert.ToInt32(rdr["emp_ID"]),
                        EmployeeName = rdr["emp_name"].ToString(),
                        EmployeeGender = rdr["gender"].ToString(),
                        EmployeeActive = Convert.ToBoolean(rdr["isActive"]),
                        EmployeeSalary = Convert.ToDecimal(rdr["emp_salary"]),
                        DepartmentID = Convert.ToInt32(rdr["dep_ID"]),
                        DepartmentName = rdr["dep_name"].ToString(),
                        EmployeeDeleted = Convert.ToBoolean(rdr["isDeleted"])
                    };
                    employees.Add(emp);
                }

                rdr.Close(); // Ensure the reader is closed before checking return value
                result = (int)returnParam.Value;
                searchCalled = true;

                if (result == -1)
                {
                    employees.Clear(); // Ensure an empty list is returned instead of null
                }

                con.Close();
            }

            return employees;
        }

        public List<Employee> GetAllEmployees(bool showDeleted)
        {
            List<Employee> employees = new List<Employee>();
            if (result != -1 || !searchCalled)
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("manageEmployee5", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@showDeleted", showDeleted ? 1 : 0);
                    conn.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                    {
                        Employee emp = new Employee
                        {
                            ID = Convert.ToInt32(rdr["emp_ID"]),
                            EmployeeName = rdr["emp_name"].ToString(),
                            EmployeeGender = rdr["gender"].ToString(),
                            EmployeeActive = Convert.ToBoolean(rdr["isActive"]),
                            EmployeeSalary = Convert.ToDecimal(rdr["emp_salary"]),
                            DepartmentID = Convert.ToInt32(rdr["dep_ID"]),
                            DepartmentName = rdr["dep_name"].ToString(),
                            EmployeeDeleted = Convert.ToBoolean(rdr["isDeleted"])
                        };
                        employees.Add(emp);
                    }
                }
            }
            return employees;
        }

        public List<Employee> GetActiveEmployees(bool showDeleted)
        {
            List<Employee> employees = new List<Employee>();
            if (result != -1 || !searchCalled)
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("manageEmployee5", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@showDeleted", showDeleted ? 1 : 0);
                    cmd.Parameters.AddWithValue("@IsActive", 1);
                    conn.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                    {
                        Employee emp = new Employee
                        {
                            ID = Convert.ToInt32(rdr["emp_ID"]),
                            EmployeeName = rdr["emp_name"].ToString(),
                            EmployeeGender = rdr["gender"].ToString(),
                            EmployeeActive = Convert.ToBoolean(rdr["isActive"]),
                            EmployeeSalary = Convert.ToDecimal(rdr["emp_salary"]),
                            DepartmentID = Convert.ToInt32(rdr["dep_ID"]),
                            DepartmentName = rdr["dep_name"].ToString(),
                            EmployeeDeleted = Convert.ToBoolean(rdr["isDeleted"])
                        };
                        employees.Add(emp);
                    }
                }
            }
            return employees;
        }
        public void InsertEmployee(Employee employee)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Employee_Name", employee.EmployeeName);
                cmd.Parameters.AddWithValue("@Employee_Gender", employee.EmployeeGender);
                cmd.Parameters.AddWithValue("@IsActive", employee.EmployeeActive);  
                cmd.Parameters.AddWithValue("@Employee_Salary", employee.EmployeeSalary);
                cmd.Parameters.AddWithValue("@Department_ID", employee.DepartmentID);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }

        public void UpdateEmployee(Employee employee)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ID", employee.ID);
                cmd.Parameters.AddWithValue("@Employee_Name", employee.EmployeeName);
                cmd.Parameters.AddWithValue("@Employee_Gender", employee.EmployeeGender);
                cmd.Parameters.AddWithValue("@IsActive", employee.EmployeeActive);
                cmd.Parameters.AddWithValue("@Employee_Salary", employee.EmployeeSalary);
                cmd.Parameters.AddWithValue("@Department_ID", employee.DepartmentID);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }

        public void DeleteEmployee(int id)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ID", id);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
    }
}