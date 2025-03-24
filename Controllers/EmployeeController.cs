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

        public ActionResult Form() { return View(); }

        [HttpGet]
        public JsonResult GetEmployeeList()
       {
            try
            {
                List<Employee> employees = dal.GetAllEmployees();
                return Json(employees);
            }
            catch (Exception e)
            {
                return Json(new { success = false, message = e.Message });
            }
        }

        [HttpGet]
        public JsonResult GetActiveEmployeeList()
        {
            try
            {
                List<Employee> employees = dal.GetActiveEmployees();
                return Json(employees);
            }
            catch (Exception e)
            {
                return Json(new { success = false, message = e.Message });
            }
        }

        [HttpPost]
        public JsonResult InsertEmployee(Employee employee)
        {
            try
            {
                dal.InsertEmployee(employee);
                return Json(new { success = true, message = "Employee Inserted successfully", employee = employee });
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
                return Json(new { success = true, message = "Employee updated sucessfully", employee = employee });
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
                return Json(new { success = true, message = "Employee deleted sucessfully", id = id });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
