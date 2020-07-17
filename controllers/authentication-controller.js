const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postAuthentication = (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({
        where: {
            username: username
        }
    })
    .then((data) => {
        if (data instanceof User) {
            bcrypt.compare(password, data.password, (err, authenticated) => {
                if (err) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }
                if (authenticated) {
                    let token = jwt.sign({
                        id: data.id,
                        username: data.username
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
        } else {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    })
    .catch((data) => res.status(500).json({ error: err }));
}