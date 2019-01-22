console.log('Resizing...')
const fs = require('fs');
var Clipper = require('image-clipper');
var dbpath = __dirname + '/public/data.json';
var db = fs.readFileSync(dbpath)
var publicpath = __dirname + '/public'
db = JSON.parse(db)
var path = require("path");
//const sharp = require('sharp');
var Jimp = require("jimp");

resize = function(fname){
   
    Jimp.read(publicpath+'/'+fname, function (err, lenna) {
        if (err) throw err;
        console.log("resizing.."+fname);
        lenna.resize(256, 150)            // resize
             .quality(60)                 // set JPEG quality
             .write(publicpath+'/image/thumb/'+fname); // save
        });
    }




db['teasers'].forEach(function(item, i) {
    ipath = item['image_url']
    fname = path.basename(ipath)
    resize(fname);
}
)

  

