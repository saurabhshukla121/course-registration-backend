const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

let router = express.Router();
const saltRounds = 10;

router.get("/list", async (req, res) => { // list of all the entries in login table
    try {
      const studentinfo = await pool.query("SELECT * FROM student");
      res.json(studentinfo.rows);
    } catch (err) {
      console.error(err.message);
    }
});

router.post('/register', function(req, res){ // register user
    try{
        bcrypt.hash(req.body.passw, saltRounds, async function(err, hash) {
            if(hash){
                try{
                    await pool.query(
                        "INSERT INTO student VALUES ($1, $2, $3, $4, $5, $6);",
                        [req.body.userId, req.body.name, req.body.joining_year , req.body.Student_DOB, 
                            req.body.Branch, hash]
                    );
                    res.json("Success");
                }
                catch(err){
                    console.log(err);
                    res.json("error");
                }
            }
            else{
                console.log(err);
                res.json("error");
            }
        });
    }catch(err){
        console.log(err);
        res.json("error");
    }
})

router.post('/verify', async function(req, res){ // verify password
    try{
        const User = await pool.query(
            "SELECT * FROM student WHERE userId=$1",
            [req.body.userId]
        );
        if(User.rowCount === 0) { // if user with given id do not exist
            res.json("User Not Found");
        }
        else{
            bcrypt.compare(req.body.passw, User.rows[0].passw, function(err, result) {
                if(!err){
                    res.json(result); // returns true if password matches
                }
                else{
                    console.log(err);
                    res.json("Incorrect Password");
                }
            });
        }
    }catch(err){
        console.log(err);
        res.json("error");
    }
})

module.exports = router;