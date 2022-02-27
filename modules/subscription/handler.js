const path = require("path"),
{pay, getOtp} = require("../../services/payment/pay");
/**
 * test payment
 * @params {request, response}
 * */
exports.makePayment = async(req, res) => {
    pay(req.body)
        .then(resp => {
            res.status(200).json(resp)
        })
        .catch(error => {
            res.status(400).json({ error })
        })
}

exports.getOtp = async(req, res) => {
    getOtp(req.body)
        .then(resp => {
            res.status(200).json(resp);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json(error)
        });
}