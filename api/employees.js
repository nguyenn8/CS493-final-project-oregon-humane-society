const router = require("express").Router();
const { validateAgainstSchema } = require("../lib/validation");
const { insertNewEmployee } = require("../models/employee");
const { generateAuthToken, requireAuthentication } = require("../lib/auth");
const {
  EmployeeSchema,
  validateEmployee,
  getEmployeesPage,
  getEmployeeById,
  deleteEmployee,
  getEmployeeServicesById,
} = require("../models/employee");

/*
 * Route to get information about all employees.
 */
router.get("/", requireAuthentication, async (req, res) => {
  try {
    const employeesPage = await getEmployeesPage(parseInt(req.query.page) || 1);
    res.status(200).send(employeesPage);
  } catch (err) {
    console.error("  -- error:", err);
    res.status(500).send({
      err: "Error fetching employees page from DB.  Try again later.",
    });
  }
});

/*
 * Route to create a new employee.
 */

router.post("/", async (req, res, next) => {
  if (validateAgainstSchema(req.body, EmployeeSchema)) {
    try {
      const id = await insertNewEmployee(req.body);
      res.status(201).send({
        _id: id,
      });
    } catch (err) {
      console.error("  -- Error:", err);
      res.status(500).send({
        error: "Error inserting new user.  Try again later.",
      });
    }
  } else {
    res.status(400).send({
      error: "Request body does not contain a valid User.",
    });
  }
});

/*
 * Route to fetch info about a specific employee
 */
router.get("/:id", requireAuthentication, async (req, res, next) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (employee) {
      res.status(200).send(employee);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch employee.  Please try again later.",
    });
  }
});

/*
 * Route to fetch info about a specific employee's services that are offered
 */

router.get("/:id/services", async (req, res, next) => {
  try {
    const services = await getEmployeeServicesById(req.params.id);
    if (services) {
      res.status(200).send(services);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch employee services.  Please try again later.",
    });
  }
});


/*
 * Endpoint for logging in as user.
 */
router.post("/login", async (req, res, next) => {
  if (req.body && req.body.username && req.body.password) {
    try {
      const authenticated = await validateEmployee(
        req.body.username,
        req.body.password
      );
      if (authenticated) {
        res.status(200).send({
          token: generateAuthToken(req.body.id),
        });
      } else {
        res.status(401).send({
          error: "Invalid authentication credentials.",
        });
      }
    } catch (err) {
      console.error("  -- error:", err);
      res.status(500).send({
        error: "Error logging in.  Try again later.",
      });
    }
  } else {
    res.status(400).send({
      error: "Request body needs `id` and `password`.",
    });
  }
});

/*
 * Endpoint to delete an existing employee.
 */
router.delete("/:id", requireAuthentication, async (req, res) => {
  try {
    const success = await deleteEmployee(req.params.id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).send({
        error: "Cannot delete an employee that does not exist.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete employee. Please try again later.",
    });
  }
});

module.exports = router;
