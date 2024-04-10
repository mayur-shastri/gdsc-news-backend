function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).send({
                message: error.details[0].message,
                success: false,
            });
        } else {
            next();
        }
    };
}

module.exports = validateBody;