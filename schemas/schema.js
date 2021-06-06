const { gql } = require("apollo-server-express");

module.exports = gql`
  type Animal {
    _id: ID!
    name: String!
    desc: String!
    date_available: Int!
    weight: Int!
    age: Int
    breed: String
    sex: String!
    location_id: Int!
  }

  type Employee {
    _id: ID!
    username: String!
    password: String!
    date_hired: Int!
    admin: Boolean!
    services: [Service!]!
  }

  type Service {
    _id: ID!
    name: String!
    desc: String!
    fee: Int!
    location_id: Int!
  }

  type Location {
    _id: ID!
    name: String!
    desc: String!
    population: Int!
    animals: [Animal!]!
  }

  type Query {
    animals: [Animal]!
    employees: [Employee]!
    locations: [Location]!
    services: [Service]!
    animal(id: ID!): Animal
    employee(id: ID!): Employee
    location(id: ID!): Location
    service(id: ID!): Service
  }
`;
