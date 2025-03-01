using Microsoft.Data.SqlClient;

namespace EmployeeManagementNew.Models
{
    public class EmployeeDAL
    {
        string connectionString = "Data Source=DESKTOP-9II8JBF\\SQLEXPRESS;Initial Catalog=employee;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";

        // Get all employees
        public List<Employee> GetEmployees()
        {
            List<Employee> employees = new List<Employee>();
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Employee employee = new Employee();
                    employee.ID = Convert.ToInt32(rdr["emp_ID"]);
                    employee.EmployeeName = rdr["emp_name"].ToString();
                    employee.EmployeeSalary = Convert.ToDecimal(rdr["emp_salary"]);
                    employee.DepartmentID = Convert.ToInt32(rdr["dep_ID"]);
                    employees.Add(employee);
                }
                con.Close();
            }
            return employees;
        }

        // Insert into employee table
        public void InsertEmployee(Employee employee)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Employee_Name", employee.EmployeeName);
                cmd.Parameters.AddWithValue("@Employee_Salary", employee.EmployeeSalary);
                cmd.Parameters.AddWithValue("@Department_ID", employee.DepartmentID);
                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // Update employee info
        public void UpdateEmployee(Employee employee)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ID", employee.ID);
                cmd.Parameters.AddWithValue("@Employee_Name", employee.EmployeeName);
                cmd.Parameters.AddWithValue("@Employee_Salary", employee.EmployeeSalary);
                cmd.Parameters.AddWithValue("@Department_ID", employee.DepartmentID);
                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // Delete employee info
        public void DeleteEmployee(int id)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ID", id);
                con.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}
