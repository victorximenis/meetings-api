const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

exports.getUsers = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM users;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                conn.release();
                const response = {
                    size: result.length,
                    data: result.map(u => {
                        return {
                            id: u.id,
                            username: u.username,
                            request: {
                                type: 'GET',
                                description: 'Retorna os detalhes de um usuario',
                                url: ((process.env.API_HOST) || 'http://localhost:' + (process.env.API_PORT || '80') + '/') + 'users/' + u.id
                            }
                        }
                    })
                };
                return res.status(200).send(response);
            }
        );
    });
}

exports.getUserById = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM users WHERE id = ?;',
            [req.params.id],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                conn.release();
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum Usuário para o ID informado'
                    });
                }
  
                const response = {
                    message: 'Usuário localizado com sucesso',
                    data: {
                        id: result[0].id,
                        username: result[0].username,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de um usuário',
                            url: ((process.env.API_HOST) || 'http://localhost:' + (process.env.API_PORT || '80') + '/') + 'users'
                        }
                    }
                };
                return res.status(200).send(response);
            }
        );
    });
}

exports.postUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        bcrypt.hash(req.body.password, process.env.PASSWORD_ENCRYPT_SALT, (errBcrypt, hash) => {
            if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
            conn.query('SELECT * FROM users WHERE username = ?;',[req.body.username], (error, result, fields) => {
              if (error) { return res.status(500).send({ error: error }) }
              if (result.length > 0) {
                return res.status(409).send({mensagem: 'Usuário já cadastrado'});
              }
              conn.query(
                  'INSERT INTO users (`username`,`password`)VALUES(?,?);',
                  [req.body.username, hash],
                  (error, result, fields) => {
                      conn.release();
                      if (error) { return res.status(500).send({ error: error }) }
        
                      const response = {
                          message: 'Usuário criado com sucesso',
                          data: {
                              username: req.body.username,
                              request: {
                                  type: 'GET',
                                  description: 'Retorna todos os usuários',
                                  url: ((process.env.API_HOST) || 'http://localhost:' + (process.env.API_PORT || '80') + '/') + 'users'
                              }
                          }
                      };
                      res.status(201).send(response);
                  }
              );
            });
        });
    });
}

exports.putUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        bcrypt.hash(req.body.password, process.env.PASSWORD_ENCRYPT_SALT, (errBcrypt, hash) => {
            if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
            conn.query('SELECT * FROM users WHERE id = ?;',[req.body.username], (error, result, fields) => {
              if (error) { return res.status(500).send({ error: error }) }
              if (result.length > 0) {
                return res.status(409).send({mensagem: 'Usuário já cadastrado'});
              }
              conn.query(
                `
                UPDATE users 
                SET username = ?, 
                password = ? 
                WHERE id = ?;
                `,
                  [req.body.username, hash, req.params.id],
                  (error, result, fields) => {
                      conn.release();
                      if (error) { return res.status(500).send({ error: error }) }
        
                      const response = {
                          message: 'Usuário atualizado com sucesso',
                          data: {
                              id: req.params.id,
                              username: req.body.username,
                              request: {
                                  type: 'GET',
                                  description: 'Retorna os detalhes de um usuário',
                                  url: ((process.env.API_HOST) || 'http://localhost:' + (process.env.API_PORT || '80') + '/') + 'users/' + req.params.id
                              }
                          }
                      };
                      res.status(201).send(response);
                  }
              );
            });
        });
    });
}

exports.deleteUser = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM users WHERE id = ?;',
            [req.params.id],
            (error, result, fields) => {
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum Usuário para o ID informado'
                    });
                }

                conn.query(
                    'DELETE FROM users WHERE id = ?;',
                    [req.params.id],
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        conn.release();
                        const response = {
                            message: 'Usuário deletado com sucesso',
                            data: {
                                id: req.params.id,
                                title: req.body.title,
                                places: req.body.places,
                                date: req.body.places,
                                request: {
                                    type: 'GET',
                                    description: 'Retorna todos os usuários',
                                    url: ((process.env.API_HOST) || 'http://localhost:' + (process.env.API_PORT || '80') + '/') + 'users'
                                }
                            }
                        };
                        return res.status(202).send(response);
                    }
                );
            }
        );
    });
}