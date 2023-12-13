'use strict';
let Producto = require('../models/producto.schema')
let fs = require('fs');
const path = require('path');

const registro_producto_admin = async (req, res) => {

    if (req.user) {
        if (req.user.role == 'admin') {
            let data = req.body
            console.log(req.files);
            console.log(data);

            let img_path = req.files.portada.path;

            let name = img_path.split('\\')
            let portada_name = name[name.length - 1];  // Tomamos el último elemento del array

            data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^w-]+/g,'')
            data.portada = portada_name;

            let reg = await Producto.create(data)

            res.status(200).send({data: reg});
        }else{
            res.status(500).send({message: 'NoAccess'})
        }
    }else{
        res.status(500).send({msessage: 'NoAccess'})
    }
}

const listar_productos_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            
            let filtro = req.params['filtro'];

            let reg = await Producto.find({titulo: new RegExp(filtro, 'i')})
            res.status(200).send({data: reg})

        }else{
            res.status(500).send({message: 'NoAccess'})
        }
    }else{
        res.status(500).send({message: 'NoAccess'})
    }
}

const obtener_portada = async (req, res) => {
    try {
      let img = req.params['img'];
      let path_img = path.join(__dirname, '../uploads/productos/', img);
      
  
      // Utilizamos fs.promises.access para verificar la existencia del archivo
      await fs.promises.access(path_img, fs.constants.F_OK);
  
      // Enviamos el archivo si existe
      res.status(200).sendFile(path.resolve(path_img));
    } catch (err) {
      console.error(err);
      let path_img_default = path.join(__dirname, '../uploads/default.jpg');
  
      // Enviamos una respuesta 200 con la imagen predeterminada si el archivo no existe
      res.status(200).sendFile(path.resolve(path_img_default));
    }
  };
  

  const obtener_producto_admin = async (req, res) => {
    if (req.user) {
      if (req.user.role === "admin") {
        let id = req.params["id"];
  
        try {
  
          let reg = await Producto.findById({ _id: id });
  
          if (!reg) {
            return res.status(404).send({message: "Producto no encontrado", data: undefined})
          }
  
          console.log(reg);
  
          res.status(200).send({ data: reg });
        } catch (error) {
          console.error("Error al obtener producto por ID:", error);
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

  const actualizar_producto_admin = async (req, res) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const id = req.params.id;
            const data = req.body;

            // Obtener el producto existente
            const producto = await Producto.findById(id);

            if (!producto) {
                return res.status(404).send({ message: 'Producto no encontrado' });
            }

            // Si hay una nueva imagen, eliminar la imagen anterior
            if (req.files && req.files.portada) {
                const imgPathAnterior = path.join(__dirname, '../uploads/productos/', producto.portada);

                // Verificar si la imagen anterior existe antes de intentar eliminarla
                await fs.promises.access(imgPathAnterior, fs.constants.F_OK);
                // Eliminar la imagen anterior
                await fs.promises.unlink(imgPathAnterior);

                // Tomar la nueva imagen
                const imgPathNueva = req.files.portada.path;
                const imgNameNueva = path.basename(imgPathNueva);

                // Actualizar el producto con la nueva imagen
                await producto.updateOne({
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    portada: imgNameNueva,
                });
            } else {
                // No hay una nueva imagen, actualizar los demás campos
                await producto.updateOne({
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                });
            }

            return res.status(200).send({ message: 'Producto actualizado correctamente' });
        } else {
            return res.status(403).send({ message: 'Acceso no autorizado' });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        return res.status(500).send({ message: 'Error al actualizar producto' });
    }
};
  

module.exports = {
    registro_producto_admin,
    listar_productos_admin,
    obtener_portada,
    obtener_producto_admin,
    actualizar_producto_admin
}
