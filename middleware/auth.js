const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    
    try {
        const header_data = req.headers.authorization.split(' ')
        if (header_data[0] != 'Bearer') { return res.status(401).send({ message: 'Unauthorized' }) }
        const token = header_data[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.usuario = decode;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    

}