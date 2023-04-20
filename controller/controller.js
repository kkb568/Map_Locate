const appDAO = require('../model/model');
const db = new appDAO();
const alert = require('alert');

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
        res.render('locateForm', {
            'email': res.locals.email
        });
    } catch (error) {
        console.log(error);
    }
}

// For posting the form data and then rendering the mapLocate page.
exports.mapLocate_page = async(req,res) => {
    // Create an address using the city, state and country values.
    var address = req.body.city + "," + req.body.state + "," + req.body.country;
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + address;

    // Fetch is used to get the latitude and longitude values, useful for inserting a marker on the map.
    fetch(url)
        .then(response => response.json())
        .then(data => addressArr = data)
        .then(put => {
            try {
                // Check if the existing user exists (so as to prevent duplicates in the database).
                db.viewUser(req.body.username, req.locals.email)
                .then((record) => {
                    console.log("Length: ",record.length);
                    // Break process if user exists.
                    if(record.length != 0) {
                        alert('Cannot repeat adding the same user.');
                        return;
                    }
                    // Add data to the database.
                    db.addLocateDetails(req.body.username, req.locals.email, addressArr[0].lat, addressArr[0].lon);
                    // Check the data's existence so that rendering of the page can happen.
                    db.viewUser(req.body.username, req.locals.email)
                    .then((record1) => {
                        console.log("Length: ",record1.length);
                        // Get coordinates for each data.
                        db.getAllCoordinates()
                        .then((entry) => {
                            console.log("Coordinates: ", entry);
                            // Load the mapLocate page.
                            res.render('mapLocate', {
                                'userLat': parseFloat(addressArr[0].lat),
                                'userLong': parseFloat(addressArr[0].lon),
                                'coordinates': entry
                            });
                        })
                    })
                })
            } catch (error) {
                console.log(error.message);
            }
        })
        .catch(err => console.log(err));
}