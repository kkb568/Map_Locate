const appDAO = require('../model/model');
const db = new appDAO();
const { decrypt } = require('node-encryption');
const encryptionKey = process.env.ENCRYPTION_KEY;
const apiKey = process.env.API_KEY;

// Render the sign up page.
exports.starting_page = async(req,res) => {
    try {
        res.redirect('/signup.html');
    } catch (error) {
        console.log(error.message);
    }
}

exports.locateForm_page = async(req,res) => {
    try {
        var decryptedEmail = decrypt(res.locals.email, encryptionKey).toString();
        db.viewUserByEmail(decryptedEmail)
        .then((record) => {
            // If there is no record, show the locateForm page.
            if (record.length == 0) {
                res.render('locateForm', {
                    'email': res.locals.email
                });
            }
            // If there is a record (user exists), show the mapLocate page directly.
            else {
                db.getAllCoordinates()
                .then((record1) => {
                    res.render('mapLocate', {
                        'userLat': parseFloat(record[0].lat),
                        'userLong': parseFloat(record[0].long),
                        'coordinates': record1,
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
                db.addLocateDetails(req.body.username, email, addressArr[0].lat, addressArr[0].lon);
                // Get coordinates for each data.
                db.getAllCoordinates()
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