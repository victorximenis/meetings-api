const Workshop = require('../models/Workshop');

exports.getWorkshops = (req, res, next) => {
    Workshop.findAll()
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        return res.status(500).json({ error: err });
    });
}

exports.getWorkshopById = (req, res, next) => {
    Workshop.findByPk(req.params.id)
    .then((data) => {
        if (data instanceof Workshop) {
            return res.json(data);
        } else {
            return res.status(404).send({mensagem: 'Workshop não encontrado'});
        }
    })
    .catch((err) => {
        return res.status(500).json({ error: err });
    });
}

exports.postWorkshop = (req, res, next) => {
    const { title, places, date } = req.body;
    Workshop.create(
        {
            title: title,
            places: places,
            date: date
        }
    )
    .then((data) => res.status(201).json({message: 'Workshop criado com sucesso'}) )
    .catch((err) => { res.status(500).send({ error: error }) });
}

exports.putWorkshop = (req, res, next) => {
    const { title, places, date } = req.body;
    Workshop.findByPk(req.params.id)
    .then((workShopFound) => {
        if (workShopFound instanceof Workshop) {
            Workshop.update({
                title: title,
                places: places,
                date: date
            }, {
                where: {
                    id: workShopFound.id
                }
            })
            .then((data) => { res.status(202).json({ message: 'Workshop atualizado com sucesso' }) })
            .catch((err) => { res.status(500).json({ error: error }) });
        } else {
            return res.status(404).send({mensagem: 'Workshop não encontrado'});
        }
    })
    .catch((err) => { res.status(500).json({ error: error }) });
}

exports.deleteWorkshop = (req, res, next) => {
    Workshop.findByPk(req.params.id)
    .then((data) => {
        if (data instanceof Workshop) {
            Workshop.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then((data) => { res.status(202).json({ message: 'Workshop deletado com sucesso' }) })
            .catch((err) => { res.status(500).send({ error: err }) });
        } else {
            return res.status(404).json({mensagem: 'Não foi encontrado nenhum Workshop para o ID informado'});
        }
    })
    .catch((err) => { res.status(500).json({ error: err }) });
}