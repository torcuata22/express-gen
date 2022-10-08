const express = require("express");
const Partner = require("../models/partner");

const partnerRouter = express.Router();

partnerRouter
  .route("/")
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partners); //jsonifies the object
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    Partner.create(req.body)
      .then((partner) => {
        res.statusCode = 201; //means you created new resource
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    Partner.findByIdAndUpdate(
      req.params.partnerId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })

  .delete((req, res) => {
    Partners.findByIdAndDelete(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  });

//partnerId Routes
partnerRouter
  .route("/:partnerId")
  .get((req, res, next) => {
    Partner.findById(rep.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end("POST request not supported");
  })
  .put((req, res) => {
    res.end(
      `Will update partner: ${req.body.name} and description: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    Partners.findByIdAndDelete(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  });

module.exports = partnerRouter;
