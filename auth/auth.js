const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');

exports.createCookie = async (req, res, next) => {
    let token = req.body.credential;
    res.cookie("jwt", token, {httpOnly:true, secure:true})
    next(); 
};

exports.getEmail = function(req, res, next) {
    var token = req.cookies.jwt;
    var decodedToken = jwt.decode(token);
    res.locals.email = decodedToken.email;
    console.log("Email: ", res.locals.email);
    next();
}

exports.verify = async (req, res, next) => {
    var token = req.cookies.jwt;
    const CLIENT_ID = "223292403996-9au02nhfodf1qbg6bsl127v8lci89859.apps.googleusercontent.com";
    const client = new OAuth2Client(CLIENT_ID);
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend.
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log("Success");
        next();
    } catch (error) {
        // console.error(error);
        let newToken = await client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.email',
        });
        console.log("New token: ", newToken);
    }
};
