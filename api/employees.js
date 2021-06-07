const router = require("express").Router();
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");

const { validateUser } = require("../lib/validation");
const { insertNewEmployee } = require("../models/employee");

const {
  EmployeeSchema,
  getEmployeesPage,
  getEmployeeById
} = require("../models/employee");


/*
 * Route to get information about all employees.
 */
 router.get('/', async (req, res) => {
  try {
    const employeesPage = await getEmployeesPage(parseInt(req.query.page) || 1);
    console.log("---locationsPage", employeesPage);
    res.status(200).send(employeesPage);
  } catch (err) {
    console.error("  -- error:", err);
    res.status(500).send({
      err: "Error fetching employees page from DB.  Try again later."
    });
  }
});

router.post("/", async (req, res, next) => {
  if (validateAgainstSchema(req.body, UserSchema)) {
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
* Route to fetch info about a specific location including adoptable animals in this location
*/
router.get('/:id', async (req, res, next) => {
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
      error: "Unable to fetch employee.  Please try again later."
    });
  }
});

/* Once you have enabled user registration for your application, implement a new POST /users/login API endpoint that allows a registered user to log in by sending their email address and password. If the email/password combination is valid, you should respond with a JWT token, which the user can then send with future requests to authenticate themselves. The JWT token payload should contain the user's ID (with which you should be able to fetch details about the user from the database) and any other information needed to implement the features described in this assignment, and it should expire after 24 hours.

If a user attempts to log in with an invalid username or password, you should respond with a 401 error. */

router.post("/login", async (req, res, next) => {
  if (req.body && req.body.id && req.body.password) {
    try {
      const authenticated = await validateUser(req.body.id, req.body.password);
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

module.exports = router;
