const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postAuthentication = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM users WHERE username = ?;`;
        conn.query(query, [req.body.username], (error, result, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if (result.length < 1) {
                return res.status(401).send({ message: 'Unauthorized' });
            }
            bcrypt.compare(req.body.password, result[0].password, (err, authenticated) => {
                if (err) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }
                if (authenticated) {
                    let token = jwt.sign({
                        id: result[0].id,
                        username: result[0].username
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    });
                    return res.status(200).send({
                        message: 'Authenticated',
                        token: token
                    });
                }
                return res.status(401).send({ message: 'Unauthorized' });
            });
        });
    });
}