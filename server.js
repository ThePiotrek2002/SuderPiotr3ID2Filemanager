var express = require("express")
var path = require('path');
var hbs = require('express-handlebars');
var app = express()
var formidable = require('formidable');
const PORT = process.env.PORT || 3000;
var path1 = require("path")
var bodyParser = require("body-parser");
const { Cipher } = require("crypto");
const { type } = require("os");
app.use(bodyParser.urlencoded({ extended: true }));
let id = 0
let UploadTab = []
let thisfile = ""

app.get("/", function (req, res) {
    res.redirect('/upload');
});

app.get("/upload", function (req, res) {
    res.render('upload.hbs', { layout: null });
});

app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', { UploadTab });
});


app.get("/removeAll", function (req, res) {
    UploadTab = []
    res.redirect("/filemanager")
});
app.get("/delete/:id", function (req, res) {
    let idget = req.params.id

    for (let i = 0; i < UploadTab.length; i++) {
        if (idget == UploadTab[i].id) {
            UploadTab.splice(i, 1)

        }
    }

    res.redirect("/filemanager")
})

app.get("/info/:id", function (req, res) {
    idget = req.params.id

    for (let i = 0; i < UploadTab.length; i++) {
        if (idget == UploadTab[i].id) {
            thisfile = UploadTab[i]
            res.redirect("/info")
        }
    }

})

app.get("/info", function (req, res) {
    res.render('info.hbs', { thisfile });
});

app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'       
    form.keepExtensions = true                           
    form.multiples = true                                                       
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(Error)
            res.send("ERROR")
            return;
        }

        if (Array.isArray(files.UploadFiles)) {
            for (var i = 0; i < files.UploadFiles.length; i++) {
                id++
                let name = files.UploadFiles[i].name
                let size = files.UploadFiles[i].size
                let type = files.UploadFiles[i].type
                let path = files.UploadFiles[i].path
                let newName = path1.basename(path);
                let extention = name.substring(name.indexOf('.')).slice(1)
                if (extention != "doc" && extention != "jpg" && extention != "pdf" && extention != "txt" && extention != "png") {
                    extention = "unknown"
                }
                let SaveDate = new Date().getTime()
                let newObject = {
                    id: id,
                    ext: extention,
                    name: name,
                    size: size,
                    type: type,
                    path: path,
                    SaveDate: SaveDate,
                    newName: newName,
                }

                UploadTab.push(newObject)
            }

        }
        else {
            id++
            let name = files.UploadFiles.name
            let size = files.UploadFiles.size
            let type = files.UploadFiles.type
            let path = files.UploadFiles.path
            let newName = path1.basename(path);
            let extention = name.substring(name.indexOf('.')).slice(1)
            if (extention != "doc" && extention != "jpg" && extention != "pdf" && extention != "txt" && extention != "png") {
                extention = "unknown"
            }
            let SaveDate = new Date().getTime()

            let newObject = {
                id: id,
                ext: extention,
                name: name,
                size: size,
                type: type,
                path: path,
                SaveDate: SaveDate,
                newName: newName,
            }

            UploadTab.push(newObject)
        }
        res.redirect("/filemanager")
    });


});

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: 'views/partials',
}));

app.set('view engine', 'hbs');                          
app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("Start serwera na porcie " + PORT)
})