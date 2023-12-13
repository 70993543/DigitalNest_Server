const Config = require('../models/config.schema');
const path = require('path');
const fs = require('fs').promises; // Importar fs.promises

const obtener_config_admin = async (req, res) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const reg = await Config.findById('657782fedd5f2bebac36c858'); // Utilizar directamente el ID
            res.status(200).send({ data: reg });
        } else {
            res.status(403).send({ message: 'Acceso no autorizado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al obtener la configuración' });
    }
};

const actualizar_config_admin = async (req, res) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const data = req.body;

            // Verificar si existe un archivo en req.files.logo
            if (req.files && req.files.logo) {

                console.log('Si hay imagen');

                const img_path = req.files.logo.path;
                const name = img_path.split('\\');
                const logo_name = name[name.length - 1];

                const reg = await Config.findByIdAndUpdate('657782fedd5f2bebac36c858', {
                    categorias: data.categorias,
                    titulo: data.titulo,
                    serie: data.serie,
                    logo: logo_name,
                    correlativo: data.correlativo
                });

                // Verificar si existe un logo anterior
                if (reg.logo) {
                    
                    // Eliminar la imagen anterior
                    const imgPathAnterior = path.join(__dirname, '../uploads/configuraciones/', reg.logo);
                    try {
                        
                        // Verificar la existencia del archivo antes de intentar eliminarlo
                        await fs.access(imgPathAnterior, fs.constants.F_OK);
                        await fs.unlink(imgPathAnterior);
                        console.log('Imagen anterior eliminada:', imgPathAnterior);
                    } catch (error) {
                        console.error('Error al eliminar la imagen anterior:', error)
                    }
                }


                res.status(200).send({ data: reg });
            } else {
                console.log('No hay img');
                const reg = await Config.findByIdAndUpdate('657782fedd5f2bebac36c858', {
                    categorias: data.categorias,
                    titulo: data.titulo,
                    serie: data.serie,
                    correlativo: data.correlativo
                });

                res.status(200).send({ data: reg });
            }
        } else {
            res.status(403).send({ message: 'Acceso no autorizado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al actualizar la configuración' });
    }
};

module.exports = {
    actualizar_config_admin,
    obtener_config_admin
};

