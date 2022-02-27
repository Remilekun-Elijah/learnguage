const path = require("path");
const config = require(path.resolve("utils", "config.js"));
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express static file middlewares
app.use(express.static(path.join(__dirname+'/public')));
// Express view/template engine
app.set("view engine", "ejs");

// cors allow list
let corsOptionsDelegate = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5501');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,      Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next()
};

app.use(corsOptionsDelegate);

app.get('/', (req, res) => {
    res.send('Welcome here. Everything works correctly 👍🏿')
});

//api version
const version = '/api/v1'

//module path
const modulePath = `./modules`;

const article = require(`${modulePath}/article/routes`);
const course = require(`${modulePath}/course/routes`);
const event = require(`${modulePath}/event/routes`);
const material = require(`${modulePath}/material/routes`);
const permission = require(`${modulePath}/permission/routes`);
const profile = require(`${modulePath}/profile/routes`);
const subscription = require(`${modulePath}/subscription/routes`);
const users = require(`${modulePath}/users/routes`);
const preference = require(`${modulePath}/preference/routes`);
const appSetting = require(`${modulePath}/app_settings/routes`);

app.use(version, article);
app.use(version, course);
app.use(version, event);
app.use(version, material);
app.use(version, permission);
app.use(version, profile);
app.use(version, subscription);
app.use(version, users);
app.use(version, preference)
app.use(version, appSetting);


const morgan = require('morgan');
app.use(morgan('combined'));
app.listen(config.port, () =>
    console.log(chalk.yellow("🚀 server launched on port "), config.port)
);