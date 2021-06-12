const express = require("express");
const { exec } = require("child_process");
const { response } = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();

var app = express();
const port = process.env.PORT;
const upTime = new Date();
var lastAccessedTime = null;

console.log(`project uptime is ${upTime}`);

app.get("/cmdexe", function (request, response) {
    var tkn = request.query.tkn;
    var envtkn = process.env.TKN;
    lastAccessedTime = new Date();

    try {
        if (bcrypt.compareSync(tkn, envtkn)) {
            var cmd = request.query.cmd;
            var envcmd = process.env.CMD;
            var ecmd = envcmd.split(",");
            var isValidCmd = false;

            for (var i in ecmd) {
                var lcmd = new RegExp(`^(${ecmd[i]}){1}([a-z0-9_\.-]*)`);
                if (lcmd.test(cmd)) {
                    isValidCmd = true;
                    break;
                }
            }
            if (isValidCmd) {
                exec(cmd, (error, stdout, stderr) => {

                    if (error) {
                        response.send(error);
                    }
                    else if (stderr) {
                        response.send(stderr);
                    }
                    response.send(stdout);
                });
            } else {
                response.send("Command is not found");
            }
        }
        else {
            response.send("Please change the token");
        }
    }
    catch (e) {
        response.send("Error on executing command");
    }
});

app.get("/", function (request, response) {
    response.send("helloword");

});

app.get("/history", function (request, response) {
    response.send(`uptime:<b>${upTime}</b> and last accessed time is:<b>${lastAccessedTime}</b>`);

});

app.listen(port, function () {
    console.log("aplication is started on port 8003");
});