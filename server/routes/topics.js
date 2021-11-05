async function getTopics(req, res) {
    const models = req.app.get('models');
    const sort = req.query.sort;

    const options = { limit: 15 }
    if (sort == "freq") {
        options['$sort'] = { count: -1 };
    }

    const topics = await models['Topic'].find({}, null, options);
    res.json({ topics })
}


module.exports = {
    getTopics,
}
