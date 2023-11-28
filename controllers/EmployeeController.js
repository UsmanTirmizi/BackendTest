import Employees from "../models/Employees.js";

//create Employee
export const createEmployeeController = async (req, res) => {
    try {
      const {
        id,
        name,
        position,
        salary,
        joiningDate,
      } = req.body;
      //validation
      switch (true) {
        case !id:
          return res.status(500).send({ error: "ID is Required" });
        case !name:
            return res.status(500).send({ error: "Name is Required" });
        case !position:
            return res.status(500).send({ error: "Position is Required" });
        case !salary:
            return res.status(500).send({ error: "Salary is Required" });
        case !joiningDate:
            return res.status(500).send({ error: "JoiningDate is Required" });    
      }
  
     const employee = new Employees({id,name,position,salary,joiningDate});
  
      await employee.save();
      res.status(201).send({
        success: true,
        message: "Employee Created Successfully",
        employee,
      });
      console.log(employee);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in creating Employee",
      });
    }
  };
  export const getAverageSalaryByDepartment = async (req, res) => {
    try {
      const averageSalaries = await Employees.aggregate([
        {
          $group: {
            _id: '$position', 
            averageSalary: { $avg: '$salary' }, 
          },
        },
      ]);
  
      res.json(averageSalaries);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  export const getEmployeesByExperience = async (req, res) => {
    const { minExperience, maxExperience } = req.query;
  
    try {
      const today = new Date();
      const minJoiningDate = new Date(today);
      minJoiningDate.setFullYear(today.getFullYear() - maxExperience);
  
      const maxJoiningDate = new Date(today);
      maxJoiningDate.setFullYear(today.getFullYear() - minExperience);
  
      const employees = await Employees.find({
        joiningDate: {
          $lte: maxJoiningDate,
          $gte: minJoiningDate,
        },
      });
  
      res.json(employees);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

 export const getTopEarners = async (req, res) => {
    try {
      const { limit } = req.query; 
  
      const topEarners = await Employees.find({})
        .sort({ salary: -1 }) 
        .limit(Number(limit));
  
      res.status(200).json({ success: true, data: topEarners });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  export const calculateRetentionRate = async (req, res) => {
    const { startDate, endDate } = req.query;
  
    try {
      const employeesAtStart = await Employees.countDocuments({ joiningDate: { $lte: new Date(startDate) } });
  
     const employeesAtEnd = await Employees.countDocuments({ joiningDate: { $lte: new Date(endDate) } });
  
      const employeesWhoLeft = await Employees.countDocuments({
        joiningDate: { $lte: new Date(startDate) },
        leavingDate: { $gte: new Date(endDate) },
      });
  
      const retentionRates = await Employees.aggregate([
        {
          $match: {
            $and: [
              { joiningDate: { $lte: new Date(startDate) } },
              {
                $or: [
                  { leavingDate: { $exists: false } },
                  { leavingDate: { $gte: new Date(endDate) } },
                ],
              },
            ],
          },
        },
        {
          $group: {
            _id: '$position',
            employeesCount: { $sum: 1 },
          },
        },
      ]);
  
      const retentionRatesWithCalculation = retentionRates.map((department) => {
        const departmentEmployees = department.employeesCount;
        const employeesLeft = (employeesWhoLeft / employeesAtStart) * departmentEmployees;
        const retentionRate = ((employeesAtEnd - employeesLeft) / employeesAtStart) * 100;
  
        return {
          department: department._id,
          retentionRate: retentionRate.toFixed(2), 
        };
      });
      res.json(retentionRatesWithCalculation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const filterBySalaryRange = async (req, res) => {
    const { minSalary, maxSalary } = req.query;
  
    try {
      const employees = await Employees.find({
        salary: { $gte: parseInt(minSalary), $lte: parseInt(maxSalary) },
      });
  
      res.json(employees);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };