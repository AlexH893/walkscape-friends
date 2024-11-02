var express = require("express");
const router = express.Router();
const Username = require("./models.js");

// GET usernames
router.get("/usernames", async (req, res) => {
  try {
    Username.find({}, function (err, usernames) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(usernames);
        res.json(usernames);
      }
    }); //.sort({ createdAt: -1 });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

// POST username
router.post("/username", async (req, res) => {
  try {
    // The username to be submitted
    const newUsername = {
      username: req.body.username ? req.body.username.replace(/\s/g, "") : null,
      date: req.body.date,
      region: req.body.region,
      steps: req.body.steps || null,
      // flagged: req.body.flagged,
    };

    await Username.create(newUsername, function (err, username) {
      if (err) {
        console.log(err);

        res.status(501).send({
          message: `Duplicate username, usernames will refresh every 24 hours`,
        });
      } else {
        console.log(username);
        res.json(username);
        console.log(
          "A new username has been added! They're username is " +
            req.body.username +
            ", it was submitted at " +
            req.body.date
        );
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception ${e.message}`,
    });
  }
});

module.exports = router;
