const { addItem } = require('./db');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var items = [];
var workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
// const dayDict = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 0: "Sunday" };

app.get("/", function (req, res) {
    var today = new Date();
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    let currentDay = today.toLocaleDateString('en-US', options);

    res.render('list', { listTitle: currentDay, lisOfItems: items });

});

app.post('/', (req, res) => {
    const newItem = req.body.newItem
    // Do something with the new item...
    items.push(newItem);
    //console.log(database.dynamodb);
    addItem(newItem);
    res.redirect("/");
})

app.get("/work", function (req, res) {
    res.render('list', { listTitle: "Work List", lisOfItems: workItems });
});

app.post('/work', (req, res) => {
    const newItem = req.body.newItem
    // Do something with the new item...
    items.push(newItem);
    //console.log(database.dynamodb);
    addItem(newItem);
    res.redirect("/work");
})

app.listen(3000, function () {
    console.log("Server started at port 3000.");
});

