# Preparation

Ensure you have installed nodejs >= version 6.10.

Ensure you have installed imagemagick before using this script. 

Mac:
brew install imagemagick

Windows:
download and install from imagemagick.org

Afterwards change into the directory of index.js and execute:
npm install

# Usage

In order to start the server execute the following
node index.js

http://localhost:9000/  --> serves the index page

This server can serve all kind of files stored in public folder this way:
http://localhost:9000/file/{filename}

For images there is a special function. To retrieve resized images you call:
http://localhost:9000/image/robot1.jpg?width=100&height=100 resize an image to width and height.

To retrieve the original image call:
http://localhost:9000/image/robot1.jpg