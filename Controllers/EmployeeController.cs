using EmployeeManagementNew.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementNew.Controllers
{
    public class EmployeeController : Controller
    {
        EmployeeDAL dal = new EmployeeDAL();

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetEmployeeList()
        {
            List<Employee> employees = dal.GetEmployees();
            return Json(employees);
        }

        [HttpPost]
        public JsonResult InsertEmployee(Employee employee)
        {
            try
            {
                dal.InsertEmployee(employee);
                return Json(new { success = true, message = "Employee added successfully!", employee = employee });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPut]
        public JsonResult UpdateEmployee(Employee employee)
        {
            try
            {
                dal.UpdateEmployee(employee);
                return Json(new { success = true, message = "Employee updated successfully!", employee = employee });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete]
        public JsonResult DeleteEmployee(int id)
        {
            try
            {
                dal.DeleteEmployee(id);
                return Json(new { success = true, message = "Employee deleted successfully!", employeeId = id });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
