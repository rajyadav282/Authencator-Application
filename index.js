const express = require("express"); 
const jwt = require("jsonwebtoken");
const app =express();
const JWT_SECRET = "msdhonithegoat";

app.use(express.json());

const users = [];      

 
app.post("/signup" , function(req,res){
    const username = req.body.username;    
    const password = req.body.password;

    users.push({
        username : username, 
        password : password
})

    res.json({
        message : "You have Successfully Signed Up"
    })
    console.log(users);
})

app.post("/signin",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;
    for(let i = 0 ; i < users.length ; i++ ) { 
        if(users[i].username === username && users[i].password === password ){
            foundUser = users[i];
        }
    }
    if(foundUser){
        const token = jwt.sign( {
            username : foundUser.username
        }, JWT_SECRET);
        foundUser.token = token;
        res.json({
            token : token 
        })
    }
    console.log(foundUser)
})

function auth ( req , res , next ){
    const token = req.headers.token;
    const decodedInfo = jwt.verify( token , JWT_SECRET );
    if(decodedInfo.username){
    req.username = decodedInfo.username;
    next();
    }
    else{
        res.json({
            message:"you are not logged in"
        })
    }
}


app.get("/me" , auth ,  function(req,res) {
    

    const user = users.find(user => user.username === req.username);

    if(user){
        res.json({
            username : user.username,
            password : user.password
        })
    }
        
    })


app.listen(3000);
