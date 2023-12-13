"use strict";

const Cliente = require("../models/cliente.schema");
const bcrypt = require("bcryptjs");
const jwt = require("../helpers/jwt");

const login_cliente = async (req, res) => {
  const data = req.body;

  try {
    let cliente_arr = await Cliente.find({ email: data.email });

    if (cliente_arr.length === 0) {
      res
        .status(200)
        .send({ message: "No se encontró el correo", data: undefined });
    } else {
      // Login
      let user = cliente_arr[0];

      bcrypt.compare(data.password, user.password, (err, result) => {
        if (err) {
          console.error("Error al comparar contraseñas:", err);
          res
            .status(500)
            .send({ message: "Error interno del servidor", data: undefined });
        } else if (result) {
          res.status(200).send({
            data: user,
            token: jwt.createToken(user),
          });
        } else {
          res
            .status(200)
            .send({ message: "La contraseña no coincide", data: undefined });
        }
      });
    }
  } catch (error) {
    console.error("Error al realizar login:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", data: undefined });
  }
};

const registro_cliente = async (req, res) => {
  let data = req.body;
  let cliente_arr = [];

  try {
    cliente_arr = await Cliente.find({ email: data.email });

    if (cliente_arr.length === 0) {
      // Hash de la contraseña
      if (data.password) {
        const saltRounds = 10;
        const hash = bcrypt.hashSync(data.password, saltRounds);

        if (hash) {
          data.password = hash;
          // Almacenar el cliente en la base de datos
          let reg = await Cliente.create(data);

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

const listar_clientes_filtro_admin = async (req, res) => {
  console.log(req.user);
  if (req.user) {
    if (req.user.role == "admin") {
      let tipo = req.params["tipo"];
      let filtro = req.params["filtro"];
      console.log(tipo);

      if (tipo == null || tipo == "null") {
        let reg = await Cliente.find();
        res.status(200).send({ data: reg });
      } else {
        if (tipo == "apellidos") {
          let reg = await Cliente.find({ apellidos: new RegExp(filtro, "i") });
          res.status(200).send({ data: reg });
        } else if (tipo == "correo") {
          let reg = await Cliente.find({ email: new RegExp(filtro, "i") });
          res.status(200).send({ data: reg });
        }
      }
    } else {
      res.status(500).send({ message: "NoAccess" });
    }
  } else {
    res.status(500).send({ message: "NoAccess" });
  }
};

const registro_cliente_admin = async (req, res) => {
  /* if (req.user) {
    if (req.user.role === 'admin') {
      let data = req.body;

      let reg = await Cliente.create(data);
      res.status(200).send({data: reg})
    }
  } */
  if (req.user) {
    if (req.user.role === "admin") {
      let data = req.body;

      // Establecemos una contraseña por defecto anets de hashearla
      const defaultPassword = "123456789";

      try {
        // Hashear la contraseña por defecto
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Asignar la contraseña hasheada al objeto de datos
        data.password = hashedPassword;

        // Registrar el cliente en la base de datos
        let reg = await Cliente.create(data);
        res.status(200).send({ data: reg });
      } catch (error) {
        console.error("Error al registrar cliente administrador:", error);
        res
          .status(500)
          .send({
            message: "Error interno del servidor al registrar cliente",
            data: undefined,
          });
      }
    } else {
      res
        .status(403)
        .send({
          message: "Acceso denegado: No eres administrador",
          data: undefined,
        });
    }
  } else {
    res.status(401).send({ message: "Acceso no autorizado", data: undefined });
  }
};

const obtener_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let id = req.params["id"];

      try {

        let reg = await Cliente.findById({ _id: id });

        if (!reg) {
          return res.status(404).send({message: "Cliente no encontrado", data: undefined})
        }

        console.log(reg);

        res.status(200).send({ data: reg });
      } catch (error) {
        console.error("Error al obtener cliente por ID:", error);
        res.status(200).send({data: undefined})
      }
    } else {
      res
        .status(403)
        .send({
          message: "Acceso denegado: No eres administrador",
          data: undefined,
        });
    }
  } else {
    res.status(401).send({ message: "Acceso no autorizado", data: undefined });
  }
};

const actualizar_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role === "admin") {
      let id = req.params["id"];
      let data = req.body;

      let reg = await Cliente.findByIdAndUpdate({_id: id}, {
        nombres : data.nombres,
        apellidos : data.apellidos,
        email: data.email,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        dni: data.dni,
        genero: data.genero
      })

    } else {
      res
        .status(403)
        .send({
          message: "Acceso denegado: No eres administrador",
          data: undefined,
        });
    }
  } else {
    res.status(401).send({ message: "Acceso no autorizado", data: undefined });
  }
}

const eliminar_cliente_admin = async (req, res) => {
  if (req.user) {
    if (req.user.role == 'admin') {
      let id = req.params['id']

      try {
        let reg = await Cliente.findByIdAndDelete({ _id: id });

        if (!reg) {
          res.status(404).send({ message: 'Cliente no encontrado', data: undefined });
        } else {
          res.status(200).send({ data: reg });
        }
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).send({ message: 'Error interno del servidor', data: undefined });
      }
    }else{
      res.status(500).send({message: 'NoAccess'});
    }
  }else{
    res.status(500).send({message: 'NoAccess'})
  }
}

const obtener_cliente_guest = async (req, res) => {
  /* if (req.user) {
    let id = req.params['id'];

    try {
      let reg = await Cliente.findById({_id:id})

      res.status(200).send({data: reg})
    } catch (error) {
      res.status(200).send({data: undefined})      
    }
  }else{
    res.status(500).send({message: 'No Access'})
  } */

  try {
    // Verifica si el usuario está autenticado
    if (!req.user) {
      return res.status(401).send({ message: "No Access" });
    }

    // Obtén el _id del cliente de los parámetros de la solicitud
    const id = req.params["id"];

    // Busca al cliente en la base de datos
    const cliente = await Cliente.findById(id);

    // Verifica si se encontró el cliente
    if (!cliente) {
      return res.status(404).send({ message: "Cliente no encontrado" });
    }

    // Envía la información del cliente como respuesta
    res.status(200).send({ data: cliente });
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", data: undefined });
  }
};

const actualizar_perfil_cliente_guest = async (req, res) => {
  try {
    // Verifica si el usuario está autenticado
    if (!req.user) {
      return res.status(401).send({ message: "No Access" });
    }

    // Obtén el _id del cliente de los parámetros de la solicitud
    const id = req.params["id"];
    const data = req.body;

    console.log("Valor de data.password:", data.password);

    // Función para actualizar el cliente
    const updateClient = async (updateData) => {
      try {
        const reg = await Cliente.findByIdAndUpdate({ _id: id }, updateData, {
          new: true,
        });
        return reg;
      } catch (err) {
        console.error("Error al actualizar cliente:", err);
        throw err;
      }
    };

    if (data.password) {
      console.log("Con contraseña");
      // Si hay una nueva contraseña, hasheamos antes de actualizar
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const updateData = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        dni: data.dni,
        genero: data.genero,
        pais: data.pais,
        password: hashedPassword,
      };

      const updatedClient = await updateClient(updateData);
      res.status(200).send({ data, updatedClient });
    } else {
      console.log("Sin contraseña");
      // Si no hay una contraseña, actualiza el resto de la información
      const updateData = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        dni: data.dni,
        genero: data.genero,
        pais: data.pais,
      };

      const updatedClient = await updateClient(updateData);
      res.status(200).send({ data: updatedClient });
    }
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res
      .status(500)
      .send({ message: "Error interno del servidor", data: undefined });
  }
};

module.exports = {
  registro_cliente,
  login_cliente,
  listar_clientes_filtro_admin,
  registro_cliente_admin,
  obtener_cliente_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin,
  obtener_cliente_guest,
  actualizar_perfil_cliente_guest,
};
