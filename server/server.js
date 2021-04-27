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

app.get("/getTotalList", function (request, response) {

  console.log("Get Total List");
  console.log(request.query);

  const id = request.query.userId;
  const dateList = request.query.dateList;

  ItemList.find({ userId: id, listDate: dateList }, function (err, result) {
    if (err) {
      res = { error: true, message: "Error Fetching Total List" }
    } else {
      res = { error: false, message: "Data Fetched Total List", totalList: result }
    }
    console.log(res);
    response.json(res);
  });
});

app.get("/getItemListData", function (request, response) {

  console.log("Get Item List");
  console.log(request.query);

  const id = request.query.userId;
  const date = request.query.listDate;

  ItemList.findOne({ userId: id, listDate: date }, 'list isSaved', function (err, result) {
    if (err) {
      res = { error: true, message: "Error Fetching Item List" };
    } else {
      res = { error: false, message: "Data Fetched Item List", itemList: result };
    }
    console.log(res);
    response.json(res);
  });
});

app.post("/saveItemListData", function (request, response) {
  console.log("Save Budget Data");
  console.log(request.body);
  var res = {};

  const userId = request.body.itemList.userId;
  const listDate = request.body.itemList.listDate;
  const isSaved = true;
  const listTotal = request.body.itemList.listTotal
  const list = request.body.itemList.list;

  const newList = new ItemList({
    userId: userId,
    listDate: listDate,
    isSaved: isSaved,
    listTotal: listTotal,
    list: list
  })

  newList.save(function (err, result) {
    if (err) {
      res = { error: true, message: "Error adding data" };
    } else {
      res = { error: false, message: "Data added", id: result._id };
    }
    console.log(res);
    //response.json(res);
  });
});

app.put("/updateItemListData", function (request, response) {
  console.log("Update Budget Data");
  console.log(request.body);
  var res = {};

  const id = request.body.itemList.userId;
  const date = request.body.itemList.listDate;
  const listTotal = request.body.itemList.listTotal
  const list = request.body.itemList.list;

  ItemList.findOneAndUpdate({ userId: id, listDate: date }, { list: list, listTotal: listTotal }, function (err, result) {
    if (err) {
      res = { error: true, message: "Error updating data" };
    } else {
      res = { error: false, message: "Data updated" };
    }
    console.log(res);
    //response.json(res);
  });
});

app.post("/save", function (request, response) {
  console.log("Save Data");
  console.log(request.body.user);
  var res = {};

  const userName = request.body.user.userName;

  console.log(userName);

  const newUser = new User({
    userName: userName
  }, { versionKey: false });

  newUser.save(function (err, result) {
    if (err) {
      res = { error: true, message: "Error adding data" };
    } else {
      res = { error: false, message: "Data added", id: result._id };
    }
    console.log(res);
    response.json(res);
  });
});

app.delete("/deleteUser", function (request, response) {
  console.log("Delete User");
  console.log(request.body.item);

  const id = request.body.item._id;
  console.log(id);

  User.findByIdAndRemove({ _id: id }, function (err, res) {
    if (err) {
      res = { error: true, message: "Error Deleting User" };
    } else {
      res = { error: false, message: "User Deleted" };
    }
    console.log(res);
  })
});

app.delete("/deleteUserData", function (request, response) {
  console.log(request.body.item);

  const id = request.body.item._id;
  console.log(id);

  console.log("Delete User Data");
  ItemList.deleteMany({ userId:id},function (err, res) {
    if (err) {
      res = { error: true, message: "Error Deleting ItemList" };
    } else {
      res = { error: false, message: "User Deleted ItemList" };
    }
    console.log(res);
    response.json(res);
  })
});

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