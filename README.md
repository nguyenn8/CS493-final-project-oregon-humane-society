# CS493 Final Project

## Overview

This is an API designed to suit the needs of a humane society, using the Oregon Humane Society as an example. Generally,the Oregon Humane Society is interested in having a database to represent all the differentanimals that are available to adopt, where each animal is located if a person is interested in visiting, employees of the shelter, and services offered by the shelter. Employees, once authorized, are able to view their employee information, their shifts, and adjust any services that they offer at the shelter (training, grooming, etc.). Anyone can view the animals, locations of animals, and services offered by the shelter.

## Routes

Here's an overview of the routes offered in this API.

### Animals

- `GET /animals` - get list of all available animals
- `GET /animals/:id` - fetch details about a particular animal
- `GET /animals/breed/:breed` - fetch all animals from a particular breed
- `GET /animals/location/:location` - fetch all animals from a particular location
- `POST /animals` - create a new adoptable animal if authenticated employee
- `PUT /animals/:id` - update details about a particular animal
- `DELETE /animals/:id` - delete a particular animal from shelter listing if they have been adopted

### Employees

- `GET /employees` - get list of all employees if admin
- `GET /employees/:id` - if employee is authenticated, get information about their employee profile
- `GET /employees/:id/services` - get list of services that this particular employee is capable of handling
- `POST /employees` - post to create new employee account if admin
- `POST /employees/login` - login as an employee
- `DELETE /employees/:id` - delete a particular employee from the database


### Locations

- `GET /locations` - get information about all locations,
- `GET /locations/:id` - get specific information about a location, including adoptable animals in this location
- `POST /locations` - add a new location if administrator
- `PUT /locations/:id` - update information about a specific location if administrator
- `DELETE /locations/:id` - delete a location from the shelter database

### Services

- `GET /services` - get information about all services
- `GET/services/:service_name` - get information about all offerings of a particular service
- `POST /services` - add a new employee for a service if administrator
- `PUT /services/:id` - update a specific service offering if administrator
- `DELETE /services/:id` - delete an offered service from the database

## Building the API

We have provided a Dockerfile and Docker Compose set up so that you can run the API server and database with ease.
