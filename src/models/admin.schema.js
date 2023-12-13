"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = Schema({
  nombres: {
    type: "string",
    required: true,
  },
  apellidos: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  telefono: {
    type: "string",
    required: true,
  },
  rol: {
    type: "string",
    required: true,
  },
  dni: {
    type: "string",
    required: true,
  },
});

module.exports = mongoose.model("admin", AdminSchema);
