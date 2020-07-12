var express = require('express');
var router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM workshops;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                conn.release();
                const response = {
                    size: result.length,
                    data: result.map(w => {
                        return {
                            id: w.id,
                            title: w.title,
                            places: w.places,
                            date: w.date,
                            request: {
                                type: 'GET',
                                description: 'Retorna os detalhes de um workshop',
                                url: ((process.env.API_HOST) || 'http://localhost:3000/') + 'workshops/' + w.id
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
            'SELECT * FROM workshops WHERE id = ?;',
            [req.params.id],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                conn.release();
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum Workshop para o ID informado'
                    });
                }

                const response = {
                    message: 'Workshop localizado com sucesso',
                    data: {
                        id: result[0].id,
                        title: result[0].title,
                        places: result[0].places,
                        date: result[0].places,
                        request: {
                            type: 'GET',
                            description: 'Retorna todos os workshops',
                            url: ((process.env.API_HOST) || 'http://localhost:3000/') + 'workshops'
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
        conn.query(
            'INSERT INTO workshops (`title`,`places`,`date`)VALUES(?,?,?);',
            [req.body.title, req.body.places, req.body.date],
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    message: 'Workshop criado com sucesso',
                    data: {
                        title: req.body.title,
                        places: req.body.places,
                        date: req.body.places,
                        request: {
                            type: 'GET',
                            description: 'Retorna todos os workshops',
                            url: ((process.env.API_HOST) || 'http://localhost:3000/') + 'workshops'
                        }
                    }
                };
                res.status(201).send(response);
            }
        );
    });
});

router.put('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `
            UPDATE workshops 
            SET title = ?, 
            places = ?, 
            date = ? 
            WHERE id = ?;
            `,
            [req.body.title, req.body.places, req.body.date, req.params.id],
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    message: 'Workshop atualizado com sucesso',
                    data: {
                        id: req.params.id,
                        title: req.body.title,
                        places: req.body.places,
                        date: req.body.places,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de um workshop',
                            url: ((process.env.API_HOST) || 'http://localhost:3000/') + 'workshops/' + req.params.id
                        }
                    }
                };
                res.status(202).send(response);
            }
        );
    });
});

router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM workshops WHERE id = ?;',
            [req.params.id],
            (error, result, fields) => {
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum Workshop para o ID informado'
                    });
                }

                conn.query(
                    'DELETE FROM workshops WHERE id = ?;',
                    [req.params.id],
                    (error, result, fields) => {
                        if (error) { return res.status(500).send({ error: error }) }
                        conn.release();
                        const response = {
                            message: 'Workshop deletado com sucesso',
                            data: {
                                id: req.params.id,
                                title: req.body.title,
                                places: req.body.places,
                                date: req.body.places,
                                request: {
                                    type: 'GET',
                                    description: 'Retorna todos os workshops',
                                    url: ((process.env.API_HOST) || 'http://localhost:3000/') + 'workshops'
                                }
                            }
                        };
                        return res.status(202).send(response);
                    }
                );
            }
        );
    });
});

module.exports = router;