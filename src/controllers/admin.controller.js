"use strict";

const Admin = require("../models/admin.schema");
const bcrypt = require("bcryptjs");
const jwt = require('../helpers/jwt')

const registro_admin = async (req, res) => {
  let data = req.body;
  let admin_arr = [];

  try {
    admin_arr = await Admin.find({ email: data.email });

    if (admin_arr.length === 0) {
      // Hash de la contraseña
      if (data.password) {
        const saltRounds = 10;
        const hash = bcrypt.hashSync(data.password, saltRounds);

        if (hash) {
          data.password = hash;
          // Almacenar el cliente en la base de datos
          let reg = await Admin.create(data);

          console.log(hash);
          res.status(200).send({ data: reg });
        } else {
          res.status(200).send({ message: "ErrorServer", data: undefined });
        }
      } else {
        res
          .status(400)
          .send({ message: "La contraseña es requerida", data: undefined });
      }
    } else {
      res.status(400).send({
        message: "El cliente ya existe en la base de datos",
        data: undefined,
      });
    }
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", data: undefined });
  }
};

const login_admin = async (req, res) => {
  const data = req.body;

  try {
    let admin_arr = await Admin.find({ email: data.email });

    if (admin_arr.length === 0) {
      res
        .status(200)
        .send({ message: "No se encontró el correo", data: undefined });
    } else {
      // Login
      let user = admin_arr[0];

      // Comparación de contraseñas de forma síncrona
      const passwordMatch = bcrypt.compareSync(data.password, user.password);

      if (passwordMatch) {
        res.status(200).send({
          data: user,
          token: jwt.createToken(user),
        });
      } else {
        res
          .status(200)
          .send({ message: "La contraseña no coincide", data: undefined });
      }
    }
  } catch (error) {
    console.error("Error al realizar login:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", data: undefined });
  }
};

module.exports = {
  registro_admin,
  login_admin
};
