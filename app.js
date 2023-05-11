//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose configuration
mongoose.connect("mongodb+srv://caiolauro:UDIPd5uoFAzo03Jy@cluster0.7h2h5fk.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

const Item = mongoose.model("Item", itemsSchema);

const toDoListItems = [];

function createListItem(itemContent) {
  const toDoListItem = new Item({ text: itemContent });
  return toDoListItem
}

const item1 = createListItem("Welcome to your To Do List!");
const item2 = createListItem("Hit the + button to add a new Item.");
const item3 = createListItem("<-- Hit this to delete an item.");

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

const TODAY = date.getDate();

// Website Routes Setup
app.get("/", function (req, res) {

  Item.find({})
    .then(function (items) {
      if (items.length === 0) {
        Item.insertMany(defaultItems)
          .then(function (response) {
            console.log("Successfully saved default items to the database.");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: TODAY, newListItems: items });
        console.log("New request succesfully served.");
      }
    })
    .catch(function (err) {
      console.log(err);
    });


});
// Dynamic Route
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);


  List.findOne({ name: customListName })
    .then(function (list) {
      if (!list) {
        console.log("List doesn't exist.")
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        console.log("List " + customListName + " created");
        res.render("list", { listTitle: list.name, newListItems: list.items });
      } else {
        res.render("list", { listTitle: list.name, newListItems: list.items });
      }
    })
    .catch(function (err) {
      console.log(err);
    })
});
app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = createListItem(itemName);

  if (listName === TODAY) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then(function (foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      })
      .catch(function (err) {
        console.log(err);
      })
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === TODAY) {
    Item.findByIdAndRemove(checkedItemId)
      .then(function (removedItem) {
        console.log("Item of ID " + checkedItemId + " deleted");
      })
      .catch(function (err) {
        console.log(err);
      });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } } // https://www.mongodb.com/docs/manual/reference/operator/update/pull/
    ).then(function (removedItem) {
      console.log("Item of ID " + checkedItemId + " deleted");
      res.redirect("/" + listName);
    })
      .catch(function (err) {
        console.log(err);
      });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
