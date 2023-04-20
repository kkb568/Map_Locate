const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const auth = require('../auth/auth');

router.get("/", controller.starting_page);

router.post("/signIn", auth.createCookie,
    controller.locateForm_page);

router.post("/mapLocatePage/:email", auth.verify,
    controller.mapLocate_page);

module.exports = router;