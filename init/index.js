const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../models/listing.js");
const path = require("path");

// Load env variables from parent folder
require('dotenv').config({ path: path.join(__dirname, "../.env") });

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB for initialization");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "69284d0558f25d8f90bde059"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB(); 