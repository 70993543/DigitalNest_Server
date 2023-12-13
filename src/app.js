"use strict";
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 4201;
const cors = require("cors");
const dbConfig = require("./config/database");

// Obtener rutas
const cliente_route = require("./routes/cliente.route");
const admin_route = require("./routes/admin.route");
const config_route = require("./routes/config.route");
const producto_route = require("./routes/producto.route");

// Configuración de CORS utilizando la librería
/* app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*'); 
  res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
  res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
  next();
}); */

// Configuración de CORS utilizando la librería
app.use(cors());

// Configuración adicional para Preflight OPTIONS

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method"
    );
    res.header("Allow", "GET, PUT, POST, DELETE, OPTIONS");
    res.status(200).end();
  } else {
    next();
  }
});

// Middleware para analizar solicitudes con cuerpo JSON
app.use(express.json());

// Middleware para analizar solicitudes con datos codificados en la URL
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose
  .connect(dbConfig.mongoURI)
  .then(() => {
    console.log("Conexión exitosa a MongoDB");
  })
  .catch((err) => {
    console.log("Error de conexión a MongoDB", err.message);
  });

app.use("/api", cliente_route);
app.use("/api", admin_route);
app.use("/api", config_route);
app.use("/api", producto_route);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchado en el puerto ${port}`);
});

module.exports = app;
