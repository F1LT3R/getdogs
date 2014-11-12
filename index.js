#!/usr/bin/env node

var createImageSizeStream = require('image-size-stream')
  , getter = require('pixel-getter')
  , Promise = require('bluebird')
  , jsdom = require('jsdom')
  , http = require('https')
  , url = require('url')
  , fs  = require('fs')
  , ansi = require('ansi')
  , program = require('commander')
  , cursor = ansi(process.stdout)
  ; 


  program
    .version('0.0.8')
    .option('-s, --search [type]', 'Return something not dogs [default is "dogs"]', 'dogs')
    .option('-n, --number [type]', 'Add the specified number of images [default is 3]', '3')
    .option('-w, --width [type]', 'The output character width [default is 80]', '80')
    .option('-m, --monotone', 'Turns off colors.')
    .parse(process.argv)
    ;

  var dawgsURL = 'https://www.google.com/search?q='+program.search+'&num='+program.number+'&tbm=isch';

  function getDogImageURLS(dogsURL){
    return new Promise(function(resolve, reject){
      
      jsdom.env({
        url: dogsURL,
        scripts: ["http://code.jquery.com/jquery.js"],

        done: function (err, window) {
          if (err!==null) return reject(error);
          
          var $ = window.$
            , dogs = $('img')
            , dogsList = []
            ;

          dogs.each(function(index, elem){
            dogsList.push(elem.src);
          });

          resolve(dogsList);
        }
      });

    });
  }



  function getImageSize(url){
    return new Promise(function(resolve, reject){
      var size = createImageSizeStream();

      var request = http.get(url, function(response) {
        response.pipe(size);
      });

      size.on('size', function(dimensions) {
        resolve(dimensions);
        request.abort();
      }).on('error', function(err) {
        reject(err);
      });

    });
  }



  function getPixelArray(url){
    return new Promise(function(resolve, reject){
      getter.get(url, function(err, pixels) {
        if (err)  return reject(err);
        resolve(pixels);
      });
    });
  }



  function getImage(url){
    return new Promise(function(resolve, reject){
      var image = {size: null, pixels: null};

      getImageSize(url)
        .then(function(size){
          image.size = size;
          return getPixelArray(url);
        })
        .then(function(pixels){
          image.pixels = pixels[0];
          resolve(image);
        })
        .catch(function(err){
          reject(err);
        })
        ;
    });
  };


  function collectImages(list){
    return new Promise(function(resolve, reject){      
      
      var imageCollection = [];
      list.forEach(function (url, index){
        
        getImage(url).then(function(image){
          image.url = url;
          imageCollection.push(image);
          
          if (imageCollection.length === list.length) {
            resolve(imageCollection);
          }
        });
      });

    });
  };



  function asciify(image){
    return new Promise(function(resolve, reject){

      var charWidth = program.width // Output with of images in terminal
      , charRamp = (" .'`^\",:;Il!i><~+_-?][}{1)(|\\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$")
      , charRampLen = charRamp.length
      , colorChannels = 3
      , valuesPerChannel = 255
      , maxRGB = colorChannels*valuesPerChannel  
      , rampRatio = charRampLen/(maxRGB+1)
      , pixels = image.pixels
      , imageWidth = image.size.width
      , imageHeight = image.size.height
      , aspectRatio = imageWidth/charWidth
      , charHeight = imageHeight/aspectRatio
      , pixel // The current pixel during the iteration
      , index // The index of the pixel in the image array
      , asciiChar // The current ascii character assigned during iteration
      , x // coord during iteration
      , y // coord during iteration
      ;

      cursor.bold();
      for (y = 0; y < charHeight; y+=2) {
        for (x = 0; x < charWidth; x+=1) {

          index = imageWidth * parseInt(y*aspectRatio) + parseInt(x*aspectRatio);
          pixel = pixels[index];
          
          brightness = pixel.r+pixel.g+pixel.b;
          asciiChar = charRamp[parseInt(rampRatio*brightness)];

          if (!program.monotone) cursor.rgb(pixel.r, pixel.g,pixel.b);
          cursor.write(asciiChar);
        }

        cursor.write('\n');
      }
      
      cursor.write('\n');
      cursor.reset();
      cursor.underline();
      if (!program.monotone) cursor.rgb(128,128,128);
      console.log(image.url+'\n\n');
    });
    
    cursor.reset();
    resolve(true);
  }


  getDogImageURLS(dawgsURL)
  .then(collectImages)
  .then(function(images){
    console.log('\n');
    return images.forEach(function(image){
      asciify(image);
    });
  })
  .catch(function(err){
    console.log('MAJOR FAIL: ', err)
  })
  ;










