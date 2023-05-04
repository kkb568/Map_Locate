const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const auth = require('../auth/auth');

router.get("/", controller.starting_page);

router.post("/signIn", auth.createCookie,
    controller.locateForm_page);

router.post("/mapLocatePage/:email", auth.verify,
    controller.mapLocate_page);

router.get("/profile/:email", auth.verify,
    controller.profilePage);

router.get("/sendEmail/:email/:lat/:long", auth.verify,
    controller.sendEmailPage);

router.post("/updatedProfile/:email", auth.verify,
    controller.updateUser,
    controller.backToMapLocate_page);

router.get("/deleteAccount/:email", controller.deleteAccount,
    auth.clearCookie,
    controller.starting_page);
    
router.get("/logout", auth.clearCookie,
    controller.starting_page);

//404 error functionality.
router.use(controller.fileError);

module.exports = router;