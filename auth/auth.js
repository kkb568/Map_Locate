const jwt = require('jsonwebtoken');
const { encrypt } = require('node-encryption');
const encryptionKey = process.env.ENCRYPTION_KEY;

exports.createCookie = async (req, res, next) => {
    // Get the Google ID token.
    let idToken = req.body.credential;
    // Decode the ID token.
    var decodedToken = jwt.decode(idToken);
    // Get the email address from the decoded token and encrypt it.
    let payload = decodedToken.email;
    res.locals.email = encrypt(payload, encryptionKey);

    // Create access token.
    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    // Create JWT cookie using the access token.
    res.cookie("jwt", accessToken, {httpOnly:true, secure:true})
    next();
};

exports.verify = async (req, res, next) => {
    var accessToken = req.cookies.jwt;
    if(!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (e) {
        res.status(401).send();
    }
};
