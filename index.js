// const express = require('express')

// const app = express()

// app.get('/', function(request, respond) {
//     respond.send('Hello Word')
// })

// app.get('/about', function(request, respond){
//     respond.send('About')
// })

// app.get('/users', function(request, respond){
//     respond.send('User')
// })

// app.post('/about', function(request, respond){
//     respond.send('About')
// })

// app.listen(3000, function(){
//     console.log('server is okay');
// })
const express = require("express")

const mongoose = require("mongoose")
const routes = require("./routes")











mongoose
	// .connect("mongodb://localhost:27017/moviebox", { useNewUrlParser: true })
	.connect("mongodb+srv://alfian:31Mei2000@spaweb.nuhh4.mongodb.net/MovieBox?retryWrites=true&w=majority", { useNewUrlParser: true })
	.then(() => {
		const app = express()
		app.use(express.json()) // new
		app.use("/api", routes)

		// app.set('view engine', 'ejs')

		app.listen(8000, () => {
			console.log("Server has started!")
		})
	})