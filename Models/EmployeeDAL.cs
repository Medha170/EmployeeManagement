using Microsoft.Data.SqlClient;
using System.Data;

namespace EmployeeManagementNew.Models
{
    public class EmployeeDAL
    {
        string connectionString = "Data Source=DESKTOP-9II8JBF\\SQLEXPRESS;Initial Catalog=employee;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

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
                        DepartmentName = rdr["dep_name"].ToString()
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


        public List<Employee> GetAllEmployees()
        {
            List<Employee> lstEmployee = new List<Employee>();
            if (result == -1 || searchCalled == false)
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                    {
                        Employee employee = new Employee();
                        employee.ID = Convert.ToInt32(rdr["emp_ID"]);
                        employee.EmployeeName = rdr["emp_name"].ToString();
                        employee.EmployeeGender = rdr["gender"].ToString();
                        employee.EmployeeActive = Convert.ToBoolean(rdr["isActive"]);
                        employee.EmployeeSalary = Convert.ToDecimal(rdr["emp_salary"]);
                        employee.DepartmentID = Convert.ToInt32(rdr["dep_ID"]);
                        employee.DepartmentName = rdr["dep_name"].ToString();
                        lstEmployee.Add(employee);
                    }
                    con.Close();
                }
            }
            return lstEmployee;
        }

        public List<Employee> GetActiveEmployees()
        {
            List<Employee> lstEmployee = new List<Employee>();
            if (result != -1 || searchCalled == false)
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IsActive", 1);
                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    while (rdr.Read())
                    {
                        Employee employee = new Employee();
                        employee.ID = Convert.ToInt32(rdr["emp_ID"]);
                        employee.EmployeeName = rdr["emp_name"].ToString();
                        employee.EmployeeGender = rdr["gender"].ToString();
                        employee.EmployeeActive = Convert.ToBoolean(rdr["isActive"]);
                        employee.EmployeeSalary = Convert.ToDecimal(rdr["emp_salary"]);
                        employee.DepartmentID = Convert.ToInt32(rdr["dep_ID"]);
                        employee.DepartmentName = rdr["dep_name"].ToString();
                        lstEmployee.Add(employee);
                    }
                    con.Close();
                }
            }
            return lstEmployee;
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