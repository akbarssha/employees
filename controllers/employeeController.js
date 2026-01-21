const Employee = require("../models/employeeModel");

// ================= CREATE =================
exports.createEmployee = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.profileImage = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      };
    }

    const employee = await Employee.create(data);

    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// ================= GET ALL (FILTERS + SEARCH + PAGINATION + SORT) =================
exports.getAllEmployees = async (req, res) => {
  try {
    const {
      department,
      salary,
      search,
      limit = 25,
      skip = 0,
      sortBy = "createdAt",
      order = "asc",
    } = req.query;

    const filter = {};

    // Filter by department
    if (department) filter.department = department;

    // Filter salary > X
    if (salary) filter.salary = { $gt: Number(salary) };

    // Search by name
    if (search) {
      filter.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = order === "desc" ? -1 : 1;

    const employees = await Employee.find(filter)
      .sort({ [sortBy]: sortOrder })
      .limit(Number(limit))
      .skip(Number(skip));

    res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET ONE =================
exports.getEmployeeById = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee)
    return res.status(404).json({ message: "Employee not found" });

  res.json(employee);
};

// ================= UPDATE (FIELDS + IMAGE) =================
exports.updateEmployee = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.profileImage = {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
      };
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: employee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ================= DELETE =================
exports.deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Employee deleted" });
};

// ================= INCREASE SALARY BY 10% =================
exports.increaseSalary = async (req, res) => {
  await Employee.updateMany({}, { $mul: { salary: 1.1 } });
  res.json({ success: true, message: "Salary increased by 10%" });
};

// ================= FIND BY SKILL =================
// exports.findBySkill = async (req, res) => {
//   const employees = await Employee.find({ skills: req.params.skill });
//   res.json(employees);
// };
exports.findBySkill = async (req, res) => {
  const employees = await Employee.find({
    skills: { $regex: req.params.skill, $options: "i" }
  });
  res.json(employees);
};

// ================= JOINED LAST 6 MONTHS =================
exports.joinedLastSixMonths = async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const employees = await Employee.find({
    dateOfJoining: { $gte: sixMonthsAgo },
  });

  res.json(employees);
};

// ================= SORT BY SALARY DESC =================
exports.sortBySalaryDesc = async (req, res) => {
  const employees = await Employee.find().sort({ salary: -1 });
  res.json(employees);
};

// ================= GROUP BY DEPARTMENT =================
exports.groupByDepartment = async (req, res) => {
  const result = await Employee.aggregate([
    {
      $group: {
        _id: "$department",
        totalEmployees: { $sum: 1 },
        avgSalary: { $avg: "$salary" },
      },
    },
  ]);

  res.json(result);
};

// ================= HIGHEST PAID EMPLOYEE =================
exports.highestPaidEmployee = async (req, res) => {
  const employee = await Employee.aggregate([
    { $sort: { salary: -1 } },
    { $limit: 1 },
  ]);

  res.json(employee[0]);
};
