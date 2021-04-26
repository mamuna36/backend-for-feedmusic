// // initialize (mock) Database
// const lowdb = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
// const adapter = new FileSync("./data/db.json");
// const db = lowdb(adapter);
// var cors = require("cors");
const mongodb = require("mongodb");
// get all records
exports.getRecords = (req, res, next) => {
  // access db from global object   // select all records
  req.app.locals.db
    .collection("records")
    .find()
    .toArray((err, docs) => {
      res.json(docs);
    });
};

// get specific record
exports.getRecord = (req, res, next) => {
  const { id } = req.params;
  req.app.locals.db
    .collection("records")
    .findOne({ _id: new mongodb.ObjectID(id) }, (err, result) => {
      res.json(result);
    });
};

// delete one record
exports.deleteRecord = (req, res, next) => {
  const { id } = req.params;
  req.app.locals.db
    .collection("records")
    .deleteOne({ _id: new mongodb.ObjectID(id) }, (err, result) => {
      if (err) console.error(err);
      console.log("del result", result);
      res.json({ deleted: result.deletedCount });
    });
};

// update one User
exports.updateRecord = (req, res, next) => {
  const { id } = req.params;
  req.app.locals.db.collection("records").updateOne(
    // filter
    { _id: new mongodb.ObjectID(id) },
    // new data
    {
      $set: req.body,
    },
    // callback function
    (err, entry) => {
      res.json(entry);
    }
  );
};
// exports.registerController = (req, res) => {
//   console.log(req.body);
//   const user = req.body;
//   req.app.locals.db.collection("users").insertOne((user, entry) => {
//     res.json(entry);
//   });
//   res.json(req.app.locals.db.collection("users").value());
// };

// register new user
exports.registerController = (req, res, next) => {
  const user = req.body;
  // access db from global object
  req.app.locals.db.collection("users").insertOne(user, (err, entry) => {
    res.json(entry);
  });
};

// Login controller
exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // get user from database
  const foundUser = await req.app.locals.db
    .collection("users")
    .findOne({ email: email });
  console.log(foundUser);
  if (!foundUser) {
    res.json({ error: "User not found" });
  } else {
    // check password
    if (password === foundUser.password) {
      const loggedInUser = foundUser;
      delete loggedInUser.password;
      res.json({ status: "logged in", user: loggedInUser });
    } else {
      res.json({ error: "Wrong password" });
    }
  }
};
// get list of all registered users
exports.usersList = (req, res, next) => {
  // access db from global object   // select all records
  req.app.locals.db
    .collection("users")
    .find()
    // callback is like await
    .toArray((err, docs) => {
      res.json(docs);
    });
};
// use updateOne for this and add the new favourites
exports.addfavourites = async (req, res) => {
  const title = req.body.title;
  const userEmail = req.body.auth;
  const user = await req.app.locals.db
    .collection("users")
    // get specific user
    .updateOne(
      { email: userEmail },
      { $push: { favourites: { $each: req.body.favourite } } }
    );

  res.json(user);
};
