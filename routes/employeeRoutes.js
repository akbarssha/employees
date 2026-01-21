const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/employeeController");

// ===== Multer Config =====
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ===== CRUD =====
router.post("/", upload.single("profileImage"), controller.createEmployee);
router.get("/getall", controller.getAllEmployees);
router.get("/:id", controller.getEmployeeById);
router.put("/:id", upload.single("profileImage"), controller.updateEmployee);
router.delete("/:id", controller.deleteEmployee);

// ===== EXTRA FEATURES =====
router.put("/salary/increase", controller.increaseSalary);
router.get("/skill/:skill", controller.findBySkill);
router.get("/joined/last-6-months", controller.joinedLastSixMonths);
router.get("/sort/salary-desc", controller.sortBySalaryDesc);

// ===== AGGREGATION =====
router.get("/aggregate/group-department", controller.groupByDepartment);
router.get("/aggregate/highest-paid", controller.highestPaidEmployee);

module.exports = router;
