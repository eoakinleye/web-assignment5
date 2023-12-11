const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

// Import data
const data = require("./data");

// Database setup
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/collegeDatabase", {useNewUrlParser: true, useUnifiedTopology: true});

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/htmlDemo", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/students", async (req, res) => {
    try {
        let students = await data.getStudents();
        if (req.query.course) {
            students = students.filter(student => student.courseID === req.query.course);
        }
        res.json(students);
    } catch (error) {
        res.json({ message: "no results" });
    }
});

app.get("/students/add", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.post("/students/add", (req, res) => {
    data.addStudent(req.body).then(()=>{
      res.redirect("/students");
    });
});

app.get("/student/:studentNum", (req, res) => {
    let studentNum = req.params.studentNum;

    data.getStudentByNum(studentNum).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({message:"no results"});
    });
});

app.get("/tas", (req,res) => {
    data.getTAs().then((data)=>{
        res.json(data);
    });
});

app.get("/courses", (req,res) => {
    data.getCourses().then((data)=>{
        res.json(data);
    });
});

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});

data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});

app.post("/student/update", (req, res) => {
    console.log(req.body);
    res.redirect("/students");
});


// const express = require("express");
// const path = require("path");
// const bodyParser = require("body-parser");
// const app = express();

// // Import data
// const data = require("./data");

// // Database setup
// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/collegeDatabase", {useNewUrlParser: true, useUnifiedTopology: true});

// const HTTP_PORT = process.env.PORT || 8080;

// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({extended: true}));

// app.get("/", (req,res) => {
//     res.sendFile(path.join(__dirname, "/views/home.html"));
// });

// app.get("/about", (req,res) => {
//     res.sendFile(path.join(__dirname, "/views/about.html"));
// });

// app.get("/htmlDemo", (req,res) => {
//     res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
// });

// app.get("/students", async (req, res) => {
//     try {
//         let students = await data.getStudents();
//         if (req.query.course) {
//             students = students.filter(student => student.courseID === req.query.course);
//         }
//         res.json(students);
//     } catch (error) {
//         res.json({ message: "no results" });
//     }
// });

// app.get("/students/add", (req,res) => {
//     res.sendFile(path.join(__dirname, "/views/addStudent.html"));
// });

// app.post("/students/add", (req, res) => {
//     data.addStudent(req.body).then(()=>{
//       res.redirect("/students");
//     });
// });

// app.get("/student/:studentNum", (req, res) => {
//     let studentNum = req.params.studentNum;

//     data.getStudentByNum(studentNum).then((data) => {
//         res.json(data);
//     }).catch((err) => {
//         res.json({message:"no results"});
//     });
// });

// app.get("/tas", (req,res) => {
//     data.getTAs().then((data)=>{
//         res.json(data);
//     });
// });

// app.get("/courses", (req,res) => {
//     data.getCourses().then((data)=>{
//         res.json(data);
//     });
// });

// app.use((req,res)=>{
//     res.status(404).send("Page Not Found");
// });

// data.initialize().then(function(){
//     app.listen(HTTP_PORT, function(){
//         console.log("app listening on: " + HTTP_PORT)
//     });
// }).catch(function(err){
//     console.log("unable to start server: " + err);
// });

// app.post("/student/update", (req, res) => {
//     console.log(req.body);
//     res.redirect("/students");
// });