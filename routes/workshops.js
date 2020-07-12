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
                return res.status(200).send({result});
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
                if (result.length > 0) {
                    return res.status(200).send(result[0]);
                } else {
                    return res.status(404).send({
                        mensagem: 'Workshop não encontrado'
                    });
                }
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

                res.status(201).send({});
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

                res.status(202).send({});
            }
        );
    });
});

router.delete('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'DELETE FROM workshops WHERE id = ?;',
            [req.params.id],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                conn.release();
                return res.status(202).send({});
            }
        );
    });
});

module.exports = router;