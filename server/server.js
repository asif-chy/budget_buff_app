const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");

const PORT = process.env.PORT || 3001;

mongoose.connect("mongodb+srv://Asiful_01:Mongo1234@cluster0.9hlzt.mongodb.net/budgetDB?retryWrites=true&w=majority", { useNewUrlParser: true });

const app = express();
app.set('view engine');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

const userSchema = {
  userName: String,
}

const itemListSchema = {
  userId: String,
  listDate: String,
  isSaved: Boolean,
  listTotal: String,
  list: Array
}

const User = mongoose.model("User", userSchema);
const ItemList = mongoose.model("ItemList", itemListSchema);

app.get("/getUserListData", function (request, response) {

  console.log("Get User List");
  //console.log(request.query);
  User.find(function (err, result) {
    if (err) {
      res = { error: true, message: "Error Fetching User List" };
    } else {
      res = { error: false, message: "Data Fetched User List", userList: result };
    }
    console.log(res);
    response.json(res);
  });
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  // All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
  
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});