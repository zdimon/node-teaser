const express = require('express')
const app = express()
const im = require('imagemagick');
const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
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
