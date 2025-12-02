require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const mongoUrl = "mongodb://127.0.0.1:27017/userDB";
mongoose.connect(mongoUrl)
    .then(() => console.log("Mongoose connected"))
    .catch(err => console.error("Mongoose connection error:", err));

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID || "test_client_id",
    clientSecret: process.env.CLIENT_SECRET || "test_client_secret",
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                return cb(null, user);
            } else {
                const newUser = new User({
                    googleId: profile.id,
                    username: profile.displayName
                });
                await newUser.save();
                return cb(null, newUser);
            }
        } catch (err) {
            return cb(err);
        }
    }
));

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect("/secrets");
    }
);

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", async function (req, res) {
    if (req.isAuthenticated()) {
        try {
            const currentUser = await User.findById(req.user.id);
            res.render("secrets", { userSecret: currentUser.secret, username: currentUser.username });
        } catch (err) {
            console.log(err);
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
});

app.get("/submit", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit", async function (req, res) {
    const submittedSecret = req.body.secret;
    try {
        const foundUser = await User.findById(req.user.id);
        if (foundUser) {
            foundUser.secret = submittedSecret;
            await foundUser.save();
            res.redirect("/secrets");
        }
    } catch (err) {
        console.log(err);
    }
});

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});

app.post("/register", function (req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
