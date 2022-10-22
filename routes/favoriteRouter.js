const express = require("express");
const favoriteRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorite = require("../models/favorite");

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        res
          .statusCode(200)
          .setHeader("Content-Type", "application/json")
          .json(favorite);
      })
      .catch((err) => next(err));

    try {
      const favorite = await Favorite.find({ user: req.user._id })
        .populate("user")
        .populate("campsites");

      res
        .statusCode(200)
        .setHeader("Content-Type", "application/json")
        .json(favorite);
    } catch (err) {
      next(err);
    }
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((fav) => {
            if (!favorite.campsites.includes(fav._id)) {
              favorite.campsites.push(fav._id);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res
                .statusCode(200)
                .setHeader("Content-Type", "application/json")
                .json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user._id })
            .then((favorite) => {
              favorite.campsites = req.body;

              favorite
                .save()
                .then((favorite) => {
                  res
                    .statusCode(200)
                    .setHeader("Content-Type", "application/json")
                    .json(favorite);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        res.statusCode(200);
        if (favorite) {
          res.setHeader("Content-Type", "application/json").json(favorite);
        } else {
          res
            .setHeader("Content-Type", "text/plain")
            .end("No favorite to delete");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
            favorite
              .save()
              .then((favorite) => {
                res
                  .statusCode(200)
                  .setHeader("Content-Type", "application/json")
                  .json(favorite);
              })
              .catch((err) => next(err));
          } else {
            res
              .statusCode(200)
              .setHeader("Content-Type", "text/plain")
              .end("That campsite already exists!!!!");
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorite) => {
              res
                .statusCode(200)
                .setHeader("Content-Type", "application/json")
                .json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId);
          if (index >= 0) favorite.campsites.splice(index, 1);
          else next("no favorite found");

          favorite
            .save()
            .then((favorite) => {
              res
                .statusCode(200)
                .setHeader("Content-Type", "application/json")
                .json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res
            .statusCode(200)
            .setHeader("Content-Type", "text/plain")
            .end("no favorite to delete");
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
