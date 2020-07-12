var express = require('express');
var router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/', (req, res, next) => {
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
                              url: ((process.env.API_HOST) || 'http://localhost:' + (process.env.API_PORT || '80') + '/') + 'users/' + w.id
                          }
                      }
                  })
              };
              return res.status(200).send(response);
          }
      );
  });
});

router.get('/:id', (req, res, next) => {
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
                          description: 'Retorna todos os usuários',
                          url: ((process.env.API_HOST) || 'http://localhost:' + (process.env.API_PORT || '80') + '/') + 'users'
                      }
                  }
              };
              return res.status(200).send(response);
          }
      );
  });
});

router.post('/', (req, res, next) => {
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
});

module.exports = router;
