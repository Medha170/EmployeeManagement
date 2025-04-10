using EmployeeManagementNew.Models;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementNew.Controllers
{
    public class DepartmentController : Controller
    {
        private readonly DepartmentDAL dal;

        public DepartmentController(DepartmentDAL dal)
        {
            this.dal = dal;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult getAllDepartments()
        {
            try
            {
                List<Department> departments = dal.GetAllDepartments();
                return Json(new { success = true, message = "Departments fetched successfully", department = departments });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult getDepartmentId(string departmentName)
        {
            try
            {
                int depId = dal.GetDepartmentId(departmentName);
                return Json(new { success = true, message = "DepartmentId fetched successfully", departmentId = depId });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}
