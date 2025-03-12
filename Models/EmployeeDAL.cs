using Microsoft.Data.SqlClient;

namespace EmployeeManagementNew.Models
{
    public class EmployeeDAL
    {
        string connectionString = "Data Source=DESKTOP-9II8JBF\\SQLEXPRESS;Initial Catalog=employee;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";
        public List<Employee> GetAllEmployees()
        {
            List<Employee> lstEmployee = new List<Employee>();
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Employee employee = new Employee();
                    employee.ID = Convert.ToInt32(rdr["emp_ID"]);
                    employee.EmployeeName = rdr["emp_name"].ToString();
                    employee.EmployeeGender = rdr["gender"].ToString();
                    employee.EmployeeSalary = Convert.ToDecimal(rdr["emp_salary"]);
                    employee.DepartmentID = Convert.ToInt32(rdr["dep_ID"]);
                    employee.DepartmentName = rdr["dep_name"].ToString();
                    lstEmployee.Add(employee);
                }
                con.Close();
            }
            return lstEmployee;
        }

        public void InsertEmployee(Employee employee)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageEmployee5", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Employee_Name", employee.EmployeeName);
                cmd.Parameters.AddWithValue("@Employee_Gender", employee.EmployeeGender);
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
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ID", employee.ID);
                cmd.Parameters.AddWithValue("@Employee_Name", employee.EmployeeName);
                cmd.Parameters.AddWithValue("@Employee_Gender", employee.EmployeeGender);
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
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ID", id);
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
            }
        }
    }
}