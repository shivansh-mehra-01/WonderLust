if (process.env.NODE_ENV != "production") {
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const reviewsRouter = require("./routes/review.js");
const listingsRouter = require("./routes/listing.js");    
const userRouter = require("./routes/user.js"); 

const dbUrl = process.env.ATLASDB_URL;

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionSecret = process.env.SESSION_SECRET || 'mysecretcode';

let store = null;
const mongoUrlForStore = dbUrl || 'mongodb://127.0.0.1:27017/wanderlust';

try {
    if (MongoStore && typeof MongoStore.create === 'function') {
        store = MongoStore.create({
            mongoUrl: mongoUrlForStore,
            touchAfter: 24 * 60 * 60,
            crypto: { 
                secret: process.env.SECRET,

             },
        });
    } else if (typeof MongoStore === 'function') {
        // Older versions export a constructor
        store = new MongoStore({
            url: mongoUrlForStore,
            touchAfter: 24 * 60 * 60,
            crypto: { 
                secret: process.env.SECRET, 

            },
        });
    } else if (MongoStore && MongoStore.default && typeof MongoStore.default.create === 'function') {
        store = MongoStore.default.create({
            mongoUrl: mongoUrlForStore,
            touchAfter: 24 * 60 * 60,
            crypto: { 
                secret: process.env.SECRET, 

            },
        });
    } else {
        console.warn('connect-mongo: could not find create() API — session store will not use MongoDB');
        store = null;
    }
} catch (e) {
    console.error('Error creating MongoStore:', e);
    store = null;
}

if (store && typeof store.on === 'function') {
    store.on('error', function (e) {
        console.error('SESSION STORE ERROR', e);
    });
}

const sessionOptions = {
    ...(store ? { store } : {}),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// home route
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

// mongoose connection 
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// catch-all 404 (use middleware-style catch-all — safest)
app.use((req, res, next) => {
    next(new ExpressError(404, "Bhai Page not found!"));
});

// error handler (robust defaults)
// error handler (robust defaults)
app.use((err, req, res, next) => {
    // if headers already sent, delegate to the default Express error handler
    if (res.headersSent) {
        // Headers already sent — log the error for debugging and do not try to send another response
        console.error("Error after headers were sent:", err);
        return;
    }
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
    console.log("app is listening on port 3000");
});
