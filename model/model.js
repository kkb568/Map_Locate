const mongoose = require('mongoose');
const { resolve } = require('path');
const schema = mongoose.Schema
const locateSchema = new schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    lat: {type: String, unique: false},
    long: {type: String, unique: false},
    role: {type: String, unique: false},
    country: {type: String, unique: false},
    state: {type: String, unique: false},
    city: {type: String, unique: false}
});
const Locate = mongoose.model("Locate", locateSchema);

class app {
    addLocateDetails(Username, Email, Lat, Long, Role, Country, State, City) {
        try {
            let newLocate = new Locate({
                username: Username,
                email: Email,
                lat: Lat,
                long: Long,
                role: Role,
                country: Country,
                state: State,
                city: City
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
            Locate.find({},{_id:0, lat:1, long:1, username:1, role:1}, function(error,entry) {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(entry);
                }
            });
        });
    }

    getEmailByCoordinates(Lat, Long) {
        return new Promise((resolve, reject) => {
            Locate.find({lat:Lat, long:Long},{_id:0, email:1}, function(error,entry) {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(entry);
                }
            });
        });
    }

    updateDetails(Email, Username, Lat, Long, Country, State, City) {
        return new Promise((resolve, reject) => {
            Locate.findOneAndUpdate({email:Email}, 
                {username:Username, lat:Lat, long:Long, country:Country, state:State, city:City},
                function(error,doc) {
                    if(error) {
                        reject(error);
                    }
                    else {
                        resolve(doc);
                    }
            });
        });
    }

    deleteDetails(Email) {
        return new Promise((resolve,reject) => {
            Locate.findOneAndDelete({email:Email}, {}, function(error, entry) {
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