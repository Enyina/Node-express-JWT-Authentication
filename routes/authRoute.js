const router = require("express").Router();
const authcController = require("../controllers/authController");

router.get("/signup", authcController.getSignup);
router.post("/signup", authcController.postSignup);
router.get("/login", authcController.getLogin);
router.post("/login", authcController.postLogin);
router.get("/logout", authcController.logout);

module.exports = router;
