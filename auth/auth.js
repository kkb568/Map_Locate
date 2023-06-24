const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('node-encryption');
const nodemailer = require('nodemailer');
const alert = require('alert');
const encryptionKey = process.env.ENCRYPTION_KEY;

exports.createCookie = async (req, res, next) => {
    // Get the Google ID token.
    let idToken = req.body.credential;
    // Decode the ID token.
    var decodedToken = jwt.decode(idToken);
    res.locals.name = decodedToken.name;
    // Get the email address from the decoded token and encrypt it.
    let email = decodedToken.email;
    res.locals.email = encrypt(email, encryptionKey);

    // Create access token.
    let accessToken = jwt.sign(idToken, process.env.ACCESS_TOKEN_SECRET);
    // Create JWT cookie using the access token.
    res.cookie("jwt", accessToken, {httpOnly:true, secure:true})
    next();
};

exports.createVerificationCode = async(req, res, next) => {
    let verifyPayload = res.locals.name;
    let recepient = decrypt(res.locals.email, encryptionKey).toString();
    // Create verification token.
    let verifyToken = jwt.sign({data: verifyPayload}, process.env.CONFIRM_TOKEN, {expiresIn: '10m'});
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS
            }
            });
            
        const mailOptions = {
            from: process.env.VERIFICATION_CODE_SENDER,
            to: recepient,
            subject: "Email verification",
            text: `Hi. Thank you for signing-in to the MapLocate application. 
                    Please copy the code below to the form for verifying your email.
                    Code: ${verifyToken}`
        };
            
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                alert('Email not sent.');
            } else {
                alert('Email sent successfully.');
            }   
        });
    } catch (error) {
        console.log(error.message);
    }
    next();
}

exports.confirmVerificationCode = async(req, res, next) => {
    jwt.verify(req.body.code, process.env.CONFIRM_TOKEN, function(err, decoded) {
        if(err) {
            console.log("Email verification failed. Possibly expired or invalid"); // TO BE CHANGED.
            return;
        }
        else {
            next();
        }
    });
}

exports.verify = async (req, res, next) => {
    var accessToken = req.cookies.jwt;
    if(!accessToken) {
        // In case the access token does not exist.
        return res.redirect('/signup');
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (e) {
        // In case there's request unauthorized error.
        clearAfterCookieReject(res);
    }
};

exports.clearCookie = function(req, res, next) {
    res
        .clearCookie("jwt")
        .clearCookie("g_state");
    next();
}

function clearAfterCookieReject(res) {
    res
        .clearCookie("jwt")
        .clearCookie("g_state")
        .redirect('/signup');
}