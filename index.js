const express = require('express')
const app = express()
const im = require('imagemagick');
const fs = require('fs');
var mustacheExpress = require('mustache-express');
var path = require("path");
var formidable = require('formidable');

app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

var dbpath = __dirname + '/public/data.json';
var db = fs.readFileSync(dbpath)
db = JSON.parse(db)

gidrate_db = function(db){
    for (var i in db['teasers']) {
        fname = path.basename(db['teasers'][i]['image_url']);

        db['teasers'][i]['fname'] = fname;
        db['teasers'][i]['type'] = path.extname(fname).replace('.','').toUpperCase();
        db['teasers'][i]['short_text'] = db['teasers'][i]['text'].substring(0,40);
    } 
}

save_db = function(){
    fs.writeFileSync(dbpath, JSON.stringify(db));
}

gidrate_db(db);


app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/public/index.html')
    res.render('index.html',db);
});


app.post('/', (req, res) => {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function (err, fields, files) {
        //console.log(files);
        //var oldpath = files.filetoupload.path;
        var oldpath = files.image.path;
        var newpath = __dirname + "/public/" + 
            path.basename(fields.fname)
            .replace(path.extname(fields.fname),'') + path.extname(files.image.name);

        fs.copyFile(oldpath, newpath, (err) => {
            if (err) throw err;
          });    

        
        db['teasers'].forEach(function(item, i) {
            fn = path.basename(item['fname'])
            if (fn==fields.fname){
                console.log(fn);
                db['teasers'][i]['image_url'] = '/image/'+fn.replace(path.extname(fn),'')+path.extname(files.image.name);
                //console.log(db['teasers'][i]);
            }
        });

        

     }
    )
    gidrate_db(db);
    save_db();
    res.redirect('/');
    //res.sendFile(__dirname + '/public/index.html')
    //res.render('index.html',db);
});


app.get('/file/:name', (req, res) => {

    var filepath = __dirname + "/public/" + req.params.name

    if (!fs.existsSync(filepath)) {
        res.status(404).send("File not found");
        return
    }

    res.sendFile(__dirname + "/public/" + req.params.name)
});

app.get('/image/:name', (req, res) => {
    //console.log(req.query.w);
    req.query.width = req.query.w
    req.query.height = req.query.h

    var imagepath = __dirname + "/public/" + req.params.name;

    if (!req.query.width ^ !req.query.height) {
        res.status(400).send("Provide either width and height parameter or none at all!");
        return
    }

    if (!fs.existsSync(imagepath)) {
        res.status(404).send("Image not found");
        return
    }

    im.identify(imagepath, function(err, features){
        if (err) throw err;

        // Check if size parameter is provided. If yes, then we'll resize the image, 
        // otherwise we will just send the original file back.
        if (req.query.width) {
            im.resize({
                srcData: fs.readFileSync(imagepath, 'binary'),
                resizeStyle: 'fill',
                width:  req.query.width,
                height:  req.query.height + "\!"
            }, function(err, stdout, stderr){
                if (err) throw err
                res.setHeader('Content-Type', 'image/' + features.format);
                res.send(new Buffer(stdout, 'binary'));
            });
        } else {
            res.sendFile(__dirname + "/public/" + req.params.name)
        }
    });
});

 
app.listen(3000, () => console.log('Example app listening on port 3000!'));
