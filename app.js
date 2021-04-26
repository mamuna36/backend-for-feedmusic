var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const { MongoClient } = require("mongodb");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(cors());
app.use(logger("dev"));
// Connect to mongodb
async function connectDB() {
  const url =
    "mongodb+srv://dbUser:BaeDW7JEpn2eRq6I@cluster0.qykt1.mongodb.net/feedmusic?retryWrites=true&w=majority";
  const client = new MongoClient(url);

  try {
    await client.connect();
    //assign db to global object
    app.locals.db = client.db();
    await listDatabases(client);
  } catch (error) {
    console.log(error);
  }
  //finally {
  //   await client.close();
  // }
}
async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}
connectDB().catch(console.error);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error logger
app.use(function (err, req, res, next) {
  console.error(err.message);
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//console.log("stack", app_router.stack);
module.exports = app;
