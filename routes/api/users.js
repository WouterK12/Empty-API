const express = require("express");
const router = express.Router();

// database
const mongoose = require("mongoose");
const User = require("../../models/User");

// cache
const NodeCache = require("node-cache");
const usersCache = new NodeCache();
const cacheTime = 60; // seconds

// GET users
router.get("/", async (req, res) => {
  console.log(`[GET] ${req.headers.host} -> USERS`);

  // check if already in cache
  let cache = usersCache.get("USERS");
  if (cache) {
    return res.status(200).send(usersCache.get("USERS"));
  }

  User.find()
    .then((users) => {
      if (!users) throw 404;

      // add to cache and send response
      usersCache.set("USERS", users, cacheTime);
      res.status(200).send(users);
    })
    .catch((err) => {
      if (err === 404) return res.status(err).send("No users found");
      res.status(500).send(err.message);
    });
});

// GET user by id
router.get("/:id", (req, res) => {
  console.log(`[GET] ${req.headers.host} -> USER (${req.params.id})`);

  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw 404;
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err === 404) return res.status(err).send("Not found");
      res.status(500).send(err.message);
    });
});

// POST new user
router.post("/", (req, res) => {
  console.log(`[POST] ${req.headers.host} -> USER`);

  const user = new User({
    _id: mongoose.Types.ObjectId(),
    ...req.body,
  });

  user
    .save()
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

module.exports = router;
