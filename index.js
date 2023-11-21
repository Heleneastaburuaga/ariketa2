const session = require('express-session')
const express = require("express");
const app = express()
const path = require("path");
const fs = require("fs");
const PORT = 4000;

// use static files
app.use(express.static("public"));

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use ejs views
app.set('view engine', 'ejs');
app.set("views", "views");


const sess = {
    secret: 'ausazko hitz multzoa',
    cookie: {}
}
app.use(session(sess))


const usersFilePath = path.join(__dirname, 'public', 'datubase.json');
const users = require(usersFilePath);

app.get('/protected',(req,res) => {

    if(req.session.userid){
        const izena = req.session.userid;
        res.send(`Welcome ${izena} <a href=\'/logout'>click to logout</a>`);
    }else
        res.redirect('/form.html');
});


app.post('/user',(req,res) => {
    const myusername = req.body.username
    const mypassword = req.body.password

    const badago = users.find(user => user.username === myusername && user.password === mypassword);
    if(badago){
        req.session.userid=myusername;
        console.log(req.session)
        res.redirect('/protected');
    }
    else{
        res.redirect('/form.html?error=true');
    }
})


app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);})
