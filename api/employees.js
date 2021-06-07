const router = require("express").Router();
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { EmployeeSchema } = require("../models/employee");
const { validateUser } = require("../lib/validation");
const { insertNewEmployee } = require("../models/employee");

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
