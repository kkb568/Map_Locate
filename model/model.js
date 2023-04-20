const mongoose = require('mongoose');
const schema = mongoose.Schema
const locateSchema = new schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    lat: {type: String, unique: false},
    long: {type: String, unique: false}
});
const Locate = mongoose.model("Locate", locateSchema);

class app {
    addLocateDetails(Username, Email, Lat, Long) {
        try {
            let newLocate = new Locate({
                username: Username,
                email: Email,
                lat: Lat,
                long: Long
            });
            newLocate.save();
        } catch (error) {
            console.log(error.message);
        }
    }

    viewUserByEmail(Email) {
        return new Promise((resolve, reject) => {
            Locate.find({email: Email}, {}, function(error, entry) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(entry);
                }
            });
        });
    }

    getAllCoordinates() {
        return new Promise((resolve, reject) => {
            Locate.find({},{_id:0, lat:1, long:1}, function(error,entry) {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(entry);
                }
            });
        });
    }
}

module.exports = app;