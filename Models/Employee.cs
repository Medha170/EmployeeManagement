namespace EmployeeManagementNew.Models
{
    public class Employee
    {
        public int ID { get; set; }
        public string EmployeeName { get; set; } = string.Empty;

        public string EmployeeGender { get; set; } = string.Empty;

        public bool EmployeeActive { get; set; } = false;

        public decimal EmployeeSalary { get; set; }
        public int DepartmentID { get; set; }

        public string DepartmentName { get; set; } = string.Empty;

    }
}
