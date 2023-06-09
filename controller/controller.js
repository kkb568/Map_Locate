const appDAO = require('../model/model');
const db = new appDAO();
const { decrypt, encrypt } = require('node-encryption');
const nodemailer = require('nodemailer');
const alert = require('alert');
const encryptionKey = process.env.ENCRYPTION_KEY;
const apiKey = process.env.API_KEY;

// Render the sign up page.
exports.starting_page = async(req,res) => {
    try {
        res.redirect('/signup');
    } catch (error) {
        console.log(error.message);
    }
}

// Render the sign-in confirm page.
exports.signUp_confirmation = async(req, res) => {
    try {
        res.render('signInConfirm', {
            'email': res.locals.email
        });
    } catch (error) {
        console.log(error.message);
    }
}

exports.locateForm_page = async(req,res) => {
    try {
        var decryptedEmail = decrypt(req.params.email, encryptionKey).toString();
        db.viewUserByEmail(decryptedEmail)
        .then((record) => {
            // If there is no record, show the locateForm page.
            if (record.length == 0) {
                res.render('locateForm', {
                    'email': req.params.email
                });
            }
            // If there is a record (user exists), show the mapLocate page directly.
            else {
                db.getAllUsers()
                .then((record1) => {
                    res.render('mapLocate', {
                        'userLat': parseFloat(record[0].lat),
                        'userLong': parseFloat(record[0].long),
                        'coordinates': record1,
                        'encryptedEmail': req.params.email,
                        'apiKey': apiKey
                    });
                })
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// For posting the form data from the locateForm page and then rendering the mapLocate page.
exports.mapLocate_page = async(req,res) => {
    // Create an address using the city, state and country values.
    var address = req.body.city + "," + req.body.state + "," + req.body.country;
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + address;

    var email = decrypt(req.params.email, encryptionKey).toString();
    // Fetch is used to get the latitude and longitude values, useful for inserting a marker on the map.
    fetch(url)
        .then(response => response.json())
        .then(data => addressArr = data)
        .then(put => {
            try {
                // Add details to the database.
                db.addLocateDetails(req.body.username, 
                    email, 
                    addressArr[0].lat,
                    addressArr[0].lon,
                    req.body.role,
                    req.body.country,
                    req.body.state,
                    req.body.city,
                    req.body.expertise,
                    req.body.interests);
                // Get all users.
                db.getAllUsers()
                .then((entry) => {
                    // Load the mapLocate page.
                    res.render('mapLocate', {
                        'userLat': parseFloat(addressArr[0].lat),
                        'userLong': parseFloat(addressArr[0].lon),
                        'coordinates': entry,
                        'encryptedEmail': req.params.email,
                        'apiKey': apiKey
                    });
                })
            } catch (error) {
                console.log(error.message);
            }
        })
        .catch(err => console.log(err));
}

// For opening the user's profile page.
exports.profilePage = async(req, res) => {
    try {
        var decryptedEmail = decrypt(req.params.email, encryptionKey).toString();
        db.viewUserByEmail(decryptedEmail)
        .then((record) => {
            res.render('profileInfo', {
                'email': req.params.email,
                'username': record[0].username,
                'country': record[0].country,
                'state': record[0].state,
                'city': record[0].city,
                'expertise': record[0].expertise,
                'interests': record[0].interests
            });
        })
    } catch (error) {
        console.log(error);
    }
}

exports.updateUser = async(req, res, next) => {
    try {
        var address = req.body.city + "," + req.body.state + "," + req.body.country;
        var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + address;

        var email = decrypt(req.params.email, encryptionKey).toString();
        // Fetch is used to get the latitude and longitude values, useful for inserting a marker on the map.
        fetch(url)
            .then(response => response.json())
            .then(data => addressArr = data)
            .then(put => {
                db.updateDetails(email,
                    req.body.username,
                    addressArr[0].lat,
                    addressArr[0].lon,
                    req.body.country,
                    req.body.state,
                    req.body.city,
                    req.body.expertise,
                    req.body.interests);
                next();
            })
    } catch (error) {
        console.log(error);
    }
}

// Takes the user back to the Map_Locate page from the profile page after submitting the form in the profile page.
exports.backToMapLocate_page = async(req,res) => {
    // Create an address using the city, state and country values.
    var address = req.body.city + "," + req.body.state + "," + req.body.country;
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + address;

    // Fetch is used to get the latitude and longitude values, useful for inserting a marker on the map.
    fetch(url)
        .then(response => response.json())
        .then(data => addressArr = data)
        .then(put => {
            try {
                // Get coordinates for each data.
                db.getAllUsers()
                .then((entry) => {
                    // Load the mapLocate page.
                    res.render('mapLocate', {
                        'userLat': parseFloat(addressArr[0].lat),
                        'userLong': parseFloat(addressArr[0].lon),
                        'coordinates': entry,
                        'encryptedEmail': req.params.email,
                        'apiKey': apiKey
                    });
                });
            } catch (error) {
                console.log(error.message);
            }
        })
        .catch(err => console.log(err));
}

// Render the sendEmail page.
exports.sendEmailPage = async(req, res) => {
    try {
        db.getEmailByCoordinates(req.params.lat, req.params.long)
        .then((entry) => {
            var recepientEmail = encrypt(entry[0].email, encryptionKey).toString();
            res.render('sendEmail', {
                'sender': req.params.email,
                'recepient': recepientEmail
            });
        });
    } catch (error) {
        console.log(error.message);
    }
}

exports.sendEmail = async(req, res) => {
    var sender = decrypt(req.body.from, encryptionKey).toString();
    var recepient = decrypt(req.body.to, encryptionKey).toString();
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS
            }
            });
            
        const mailOptions = {
            from: sender,
            to: recepient,
            subject: req.body.subject,
            text: req.body.message
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
}

// Delete user's account.
exports.deleteAccount = async(req, res, next) => {
    try {
        var email = decrypt(req.params.email, encryptionKey).toString();
        db.deleteDetails(email);
        next();
    } catch (error) {
        console.log(error.message);
    }
}

// Render 404-error page.
exports.fileError = function(req, res) {
    res.status(404);
    res.render('404Error');
}