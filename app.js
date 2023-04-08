const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config();
// console.log(process.env);

const app = express();
 
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const listId = process.env.LIST_ID;
    const serverNum = process.env.SERVER_NUM;
    const url = `https://us${serverNum}.api.mailchimp.com/3.0/lists/${listId}`;

    const options = {
        method: "POST",
        auth: `sachin1:${process.env.API_KEY}`

    }

    const request = https.request(url, options, function(response) {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        // response.on("data", function(data) {
        //     console.log(JSON.parse(data));
        // })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
})

const portUsed = process.env.PORT || 3000; 

app.listen(portUsed, () => {
    console.log(`server is running on port ${portUsed}`);
});


