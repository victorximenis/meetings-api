const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getUsers = (req, res, next) => {
    User.findAll()
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        return res.status(500).json({ error: err });
    });
}

exports.getUserById = (req, res, next) => {
    User.findByPk(req.params.id)
    .then((data) => {
        if (data instanceof User) {
            return res.json(data);
        } else {
            return res.status(404).json({mensagem: 'Usuário não encontrado'});
        }
    })
    .catch((err) => {
        return res.status(500).json({ error: err });
    });
}

exports.postUser = (req, res, next) => {
    const { username, password } = req.body;

    bcrypt.hash(password, process.env.PASSWORD_ENCRYPT_SALT, (errBcrypt, hash) => {
        if (errBcrypt) { return res.status(500).json({ error: errBcrypt }) }
        User.findAll({
            where: {
                username: username
            }
        })
        .then((data) => {
            if (data.length > 0) {
                return res.status(409).json({mensagem: 'Usuário já cadastrado'});
            }
            User.create({
                username: username,
                password: hash
            })
            .then((d) => {
                return res.json(d);
            })
            .catch((error) => {
                return res.status(500).json({ error: error });
            });
        })
        .catch((err) => {
            return res.status(500).json({ error: err });
        });
    });
}

exports.putUser = (req, res, next) => {
    const { username, password } = req.body;
    User.findByPk(req.params.id)
    .then((data) => {
        if (data instanceof User) {
            User.findAll({
                where: {
                    username: username
                }
            })
            .then((userFound) => {
                console.log(userFound);
                if (userFound.length > 0) {
                    return res.status(409).json({mensagem: 'Nome de usuário já cadastrado'});
                } else {
                    bcrypt.hash(password, process.env.PASSWORD_ENCRYPT_SALT, (errBcrypt, hash) => {
                        if (errBcrypt) { return res.status(500).json({ error: errBcrypt }) }
                        User.update({
                            username: username,
                            password: hash
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                        .then((d) => {
                            return res.json(d);
                        })
                        .catch((error) => {
                            return res.status(500).json({ error: error });
                        });
                    });
                }
            })
            .catch((error) => {
                return res.status(500).json({ error: error });
            });
        } else {
            return res.status(404).json({mensagem: 'Usuário não encontrado'});
        }
    })
    .catch((err) => {
        return res.status(500).json({ error: err });
    });
}

exports.deleteUser = (req, res, next) => {
    User.findByPk(req.params.id)
    .then((data) => {
        if (data instanceof User) {
            User.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then((d) => {
                return res.json(d);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({ error: error });
            });
        } else {
            return res.status(404).json({mensagem: 'Usuário não encontrado'});
        }
    })
    .catch((err) => {
        return res.status(500).json({ error: err });
    });
}