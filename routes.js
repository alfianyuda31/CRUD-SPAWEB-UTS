const express = require("express")
const Movie = require("./models/Movie") // new
const Serie = require("./models/Serie") // new
const router = express.Router()
var path = require('path');
var jwt = require("jsonwebtoken");
var cors = require("cors");
const Auth = require("./models/Auth")
router.use(cors());





//Function mengecek token
function isAuthenticated(req, res, next) {
    var token = req.header("auth-token") || req.params.id;
    if (token) {
        jwt.verify(token, "inikode", function (err, decoded) {
            if (err) {
                //apabila ada error
                res.json({
                    message: "Failed to authenticate token"
                });
            } else {
                //apabila tidak eror
                req.decoded = decoded;
                next(); //melanjutkan proses
            }
        });
    } else {
        return res.status(403).send({
            message: "No token Provided!!"
        });
    }
}


// function untuk refresh token
router.post("/refresh_token", async (req, res) => {
    var last_username = req.body.username;
    var last_token = req.body.last_token;

    jwt.verify(last_token, "inikode", function (err, decoded) {
        //jwt melakukan verify
        if (err) {
            // apa bila ada error
            res.json({
                message: "Failed to authenticate token"
            }); // jwt melakukan respon
        } else {
            // apa bila tidak error
            req.decoded = decoded; // menyimpan decoded ke req.decoded

            // terbitkan token baru
            var token = jwt.sign({
                last_username
            }, "inikode", {
                algorithm: "HS256",
                expiresIn: "10s",
            });
            return res.status(200).json({
                token: token,
                status: res.statusCode,
                message: "Token Baru!",
            });
        }
    });
});


//Function cek apa boleh akses halaman
router.post("/cek_page", async (req, res) => {
    var old_token = req.body.old_token;
    jwt.verify(old_token, "inikode", function (err, decoded) {
        //jwt melakukan verify
        if (err) {
            // apa bila ada error
            // res.json({message: 'Halaman Tidak Diijinkan Diakses'}); // jwt melakukan respon
            return res.status(200).json({
                message: "not_ok",
            });
        } else {
            return res.status(200).json({
                message: "ok",
            });
        }
    });
});


// Router Untuk SPA page ====
router.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname + '/view/index.html'));
})

router.get("/admin", async (req, res) => {
    res.sendFile(path.join(__dirname + '/view/admin_dashboard.html'));
})
router.get("/series", async (req, res) => {
    res.sendFile(path.join(__dirname + '/view/series.html'));
})



//menampilkan halaman login
router.get("/login", async (req, res) => {
    res.sendFile(path.join(__dirname + "/view/login.html"));
});


// ======== Router authentication dan token ========
router.post("/login_auth", async (req, res) => {
    const user = await Auth.findOne({
        username: req.body.username,
        password: req.body.password,
    });
    if (!user)
        return res.status(400).json({
            status: res.statusCode,
            message: "Gagal Login!",
        });
    else
        var token = jwt.sign({
            username: req.body.username
        }, "inikode", {
            algorithm: "HS256",
            expiresIn: "10s"
        });
    return res.status(200).json({
        token: token,
        username: req.body.username,
        status: res.statusCode,
        message: "Sukses Login!",
    });
});







// Router Untuk Blog ====
router.get("/ambilmovieadmin",isAuthenticated, async (req, res, next) => {

    const ambilmovie = await Movie.find()
    res.send(ambilmovie)
})

// Get all posts
router.get("/ambilmovie", async (req, res) => {

    const ambilmovie = await Movie.find()
    res.send(ambilmovie)
})

// posting data
router.post("/ambilmovie", async (req, res) => {
    const ambilmovie = new Movie({
        Title: req.body.Title,
        Year: req.body.Year,
        imdbID: req.body.imdbID,
        Type: req.body.Type,
        Poster: req.body.Poster,
    })
    await ambilmovie.save()
    res.send(ambilmovie)
})

// update salah satu data di database  
router.patch("/ambilmovie/:id", async (req, res) => {
    try {
        const ambilmovie = await Movie.findOne({
            _id: req.params.id
        })

        if (req.body.Title) {
            ambilmovie.Title = req.body.Title
        }

        if (req.body.Year) {
            ambilmovie.Year = req.body.Year
        }

        if (req.body.imdbID) {
            ambilmovie.imdbID = req.body.imdbID
        }

        if (req.body.Type) {
            ambilmovie.Type = req.body.Type
        }

        if (req.body.Poster) {
            ambilmovie.Poster = req.body.Poster
        }
        await ambilmovie.save()
        res.send(ambilmovie)
    } catch {
        res.status(404)
        res.send({
            error: "Post doesn't exist!"
        })
    }
})

// delete
router.delete("/ambilmovie/:id", async (req, res) => {
    try {
        await Movie.deleteOne({
            _id: req.params.id
        })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({
            error: "Post doesn't exist!"
        })
    }
})

// ambil satu data
router.get("/ambilmovie/:id", async (req, res) => {
	try {
		const ambilmovie = await Movie.findOne({
			_id: req.params.id
		})
		res.send(ambilmovie)
	} catch {
		res.status(404)
		res.send({
			error: "Post doesn't exist!"
		})
	}
})





//========= Router Untuk Berita ====
// Get all posts
router.get("/ambilserieadmin",isAuthenticated, async (req, res, next) => {

    const ambilserie = await Serie.find()
    res.send(ambilserie)
})

router.get("/ambilserie", async (req, res) => {

    const ambilserie = await Serie.find()
    res.send(ambilserie)
})

// posting data
router.post("/ambilserie", async (req, res) => {
    const ambilserie = new Serie({
        Title: req.body.Title,
        Year: req.body.Year,
        imdbID: req.body.imdbID,
        Type: req.body.Type,
        Poster: req.body.Poster,
    })
    await ambilserie.save()
    res.send(ambilserie)
})

// update salah satu data di database  
router.patch("/ambilserie/:id", async (req, res) => {
    try {
        const ambilserie = await Serie.findOne({
            _id: req.params.id
        })

        if (req.body.Title) {
            ambilserie.Title = req.body.Title
        }

        if (req.body.Year) {
            ambilserie.Year = req.body.Year
        }

        if (req.body.imdbID) {
            ambilserie.imdbID = req.body.imdbID
        }

        if (req.body.Type) {
            ambilserie.Type = req.body.Type
        }

        if (req.body.Poster) {
            ambilserie.Poster = req.body.Poster
        }

        await ambilserie.save()
        res.send(ambilserie)
    } catch {
        res.status(404)
        res.send({
            error: "Post doesn't exist!"
        })
    }
})

router.delete("/ambilserie/:id", async (req, res) => {
    try {
        await Serie.deleteOne({
            _id: req.params.id
        })
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({
            error: "Post doesn't exist!"
        })
    }
})

router.get("/ambilserie/:id", async (req, res) => {
    try {
        const ambilserie = await Serie.findOne({
            _id: req.params.id
        })
        res.send(ambilserie)
    } catch {
        res.status(404)
        res.send({
            error: "Post doesn't exist!"
        })
    }
})










module.exports = router