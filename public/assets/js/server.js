// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../../public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../../index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "../../notes.html"));
});

// Handles api get request
app.get("/api/notes", function (req, res) {
  fs.readFile(path.join(__dirname, "../../../db/db.json"), "utf8", function (
    err,
    data
  ) {
    if (err) {
      throw err;
    }
    res.json(JSON.parse(data));
  });
});

// Handles api post request
app.post("/api/notes", function (req, res) {
  var notesData;
  fs.readFile(path.join(__dirname, "../../../db/db.json"), "utf8", function (
    err,
    data
  ) {
    if (err) {
      throw err;
    }
    notesData = JSON.parse(data);

    const newNote = {
      id: Date.now(),
      title: req.body.title,
      text: req.body.text,
    };

    notesData.push(newNote);

    writeToFile(notesData, res);
  });
});

// Handles api delete request
app.delete("/api/notes/:id", function (req, res) {
  var notesData;
  const id = req.params.id;
  fs.readFile(path.join(__dirname, "../../../db/db.json"), "utf8", function (
    err,
    data
  ) {
    if (err) {
      throw err;
    }
    notesData = JSON.parse(data);

    for (var i = 0; i < notesData.length; i++) {
      if (notesData[i].id == id) {
        notesData.splice(i, 1);
        break;
      }
    }

    writeToFile(notesData, res);
  });
});

// Writes the updated data to the backend file
function writeToFile(notesData, res) {
  fs.writeFile(
    path.join(__dirname, "../../../db/db.json"),
    JSON.stringify(notesData),
    function (err) {
      if (err) {
        throw err;
      }
    }
  );

  res.json(notesData);
}

// Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
