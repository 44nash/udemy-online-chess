const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const {validationResult} = require('express-validator');

const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "secret";

exports.register = (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.redirect('/register?error=' + errors.array()[0].msg)
        }

        const {username, email, password, confirmPassword} = req.body;

        if(password !== confirmPassword){
            return res.redirect('/register?error=Password do not match')
        }

        let query = `select id from users where username='${username}' or email='${email}'`;

        db.query(query, async(err, result) => {
            if(err){
                throw err;
            }

            if(result.length > 0){
                return res.redirect('/register?error=Username or email is already taken!');
            }

            const encryptedPassword = await bcrypt.hash(password, 10)

            query = `call createUser('${username}', '${email}', '${encryptedPassword}')`;

            db.query(query, (err) => {
                if(err){
                    throw err;
                }
                query = `select id from users where email='${email}'`;

                db.query(query, (err, result) => {
                    if(err){
                        throw err;
                    }
                    if(result.length === 0){
                        res.redirect("/register?error=Something went wrong");
                    }

                    let userId = result[0].id;

                    const payload = {
                        id: userId, username, email
                    };

                    jwt.sign(payload, jwtSecret, (err, token) => {
                        if(err){
                            throw err;
                        }

                        res.cookie("token", token, {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})
                        res.cookie("user_rank", 'beginner' , {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})
                        res.cookie("user_points", 1000, {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})

                        res.redirect("/?success=You have register your user successfully");

                        //res.json({user: payload, token})
                    })

                })
            })
        })
    } catch (error) {
        console.log(err)

        res.redirect("/register?error=Something went wrong");
        //res.status(500).json({error: err.message});
    }
}

exports.login = (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.redirect("/login?error=" + errors.array()[0].msg)
        }

        const {email, password} = req.body;

        let query = `select * from users where email='${email}'`;

        db.query(query, async (err, result) => {
            if(err){
                throw err;
            }

            if(result.length === 0){
                return res.redirect('/login?error=Email or password is incorrect');
            }
            let user = result[0];

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.redirect('/login?error=Email or password is incorrect');
            }

            query = `select user_rank, user_points from user_info where user_id=${user.id}`;

            db.query(query, (err, result) => {
                if(err){
                    throw err;
                }

                let userInfo = result[0];
                const payload = {
                    id: user.id, username: user.username, email
                };

                jwt.sign(payload, jwtSecret, (err, token) => {
                    if(err){
                        throw err;
                    }

                    res.cookie("token", token, {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})
                    res.cookie("user_rank", userInfo.user_rank, {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})
                    res.cookie("user_points", userInfo.user_points, {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})

                    res.redirect("/?success=You have logged in successfully");
                })

            })
        })
    } catch (error) {
        console.log(err);
        res.redirect('/login?error=Something went wrong')
    }
}

exports.getInfo = (req, res) => {
    try {
        jwt.verify(req.cookies.token, jwtSecret, (err, userPayload) => {
            if(err) throw err;

            const {id, email, username} = userPayload

            let user = {
                id,
                username,
                email,
                user_rank: req.cookies.user_rank,
                user_points: req.cookies.user_points
            }

            return res.json(user)

            // let query = `select user_rank, user_points from user_info where user_id=${id}`;

            // db.query(query, (err, result) => {
            //     if(err) throw err;

            //     if(result.length === 0){
            //         return res.status(404).json({error: "User not found"})
            //     }

            //     let userInfo = result[0];

            //     res.cookie("token", token, {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})
            //     res.cookie("user_rank", userInfo.user_rank, {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})
            //     res.cookie("user_points", userInfo.user_points, {maxAge: 1000 * 60 * 60 * 24 * 30 * 6, httpOnly: true, secure: false, sameSite: 'strict'})


            // })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message});
    }
}