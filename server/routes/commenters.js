async function getCommenter(req, res) {
    const models = req.app.get('models');
    const _id = req.params.commenterId;
    console.log("Finding commenter", _id)
    const commenter = await models['Commenter'].findById(_id)
    res.json({ commenter })
}


async function editCommenter(req, res) {
    const models = req.app.get('models');
    const _id = req.params.commenterId;


    console.log("updating commenter", _id)
    let success, message;

    try {
        const reaction = req.query.reaction;
        if (!reaction) {
            success = false;
        } else {
            const incrementer = { $inc: {} };
            incrementer["$inc"][reaction] = 1;
            await models['Commenter'].findOneAndUpdate({ _id }, incrementer);
            success = true;
        }
    } catch (e) {
        message = e.message;
        success = false;
        console.log(e);
    }
    res.json({ success, message })
}


module.exports = {
    getCommenter,
    editCommenter
}