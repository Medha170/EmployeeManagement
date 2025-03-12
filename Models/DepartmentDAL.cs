using Microsoft.Data.SqlClient;

namespace EmployeeManagementNew.Models
{
    public class DepartmentDAL
    {
        string connectionString = "Data Source=DESKTOP-9II8JBF\\SQLEXPRESS;Initial Catalog=employee;Integrated Security=True;Encrypt=True;Trust Server Certificate=True";
        public List<Department> GetAllDepartments()
        {
            List<Department> lstDepartment = new List<Department>();

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageDepartment", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Department department = new Department();
                    department.DepartmentId = Convert.ToInt32(rdr["dep_ID"]);
                    department.DepartmentName = rdr["dep_name"].ToString();
                    lstDepartment.Add(department);
                }
                con.Close();
            }

            return lstDepartment;
        }

        public int GetDepartmentId(string departmentName)
        {
            int departmentId = 0;
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand("manageDepartment", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Dep_Name", departmentName);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.Read())
                {
                    departmentId = (int)rdr["dep_ID"];
                }
                con.Close();
            }
            return departmentId;
        }
    }
}
