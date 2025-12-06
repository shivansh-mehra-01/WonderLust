const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../models/listing.js");

// mongoose connection 

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69284d0558f25d8f90bde059"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB(); 