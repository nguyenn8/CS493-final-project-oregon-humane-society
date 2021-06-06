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
    id: ID!
    username: String!
    password: String!
    date_hired: Int!
    admin: Boolean!
    services: [Service!]!
  }

  type Service {
    id: ID!
    name: String!
    desc: String!
    fee: Int!
    location_id: Int!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    population: Int!
    animals: [Animal!]!
  }

  type Query {
    animals: [Animal]!
    animal(id: ID!): Animal
  }
`;
