const Config = require('../models/config.schema');
const path = require('path');
const fsPromises = require('fs').promises;

const obtener_config_admin = async (req, res) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const reg = await Config.findById('657782fedd5f2bebac36c858');
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

            if (req.files && req.files.logo) {
                console.log('Si hay imagen');

                const img_path = req.files.logo.path;
                const name = img_path.split('\\');
                const logo_name = name[name.length - 1];

                const reg = await Config.findByIdAndUpdate('657782fedd5f2bebac36c858', {
                    categorias: JSON.parse(data.categorias),
                    titulo: data.titulo,
                    serie: data.serie,
                    logo: logo_name,
                    correlativo: data.correlativo
                });

                if (reg.logo) {
                    const imgPathAnterior = path.join(__dirname, '../uploads/configuraciones/', reg.logo);
                    try {
                        await fsPromises.unlink(imgPathAnterior);
                        console.log('Imagen anterior eliminada:', imgPathAnterior);
                    } catch (error) {
                        console.error('Error al eliminar la imagen anterior:', error);
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

const obtener_logo = async (req, res) => {
    try {
        const img = req.params['img'];
        const path_img = path.join(__dirname, '../uploads/configuraciones/', img);

        await fsPromises.access(path_img, fsPromises.constants.F_OK);

        res.status(200).sendFile(path.resolve(path_img));
    } catch (err) {
        console.error(err);
        let path_img_default = path.join(__dirname, '../uploads/default.jpg');

        res.status(404).sendFile(path.resolve(path_img_default));
    }
};

const obtener_config_publico = async (req, res) => {
    let reg = await Config.findById('657782fedd5f2bebac36c858')
    res.status(200).send({data: reg})

}

module.exports = {
    actualizar_config_admin,
    obtener_config_admin,
    obtener_logo,
    obtener_config_publico
};


