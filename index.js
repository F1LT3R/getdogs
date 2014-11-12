#!/usr/bin/env node

var createImageSizeStream = require('image-size-stream')
  , getter = require('pixel-getter')
  , Promise = require('bluebird')
  , request = require('request')
  , jsdom = require('jsdom')
  , http = require('https')
  , url = require('url')
  , fs  = require('fs')
  ; 

var dawgsURL = 'https://www.google.com/search?q=dogs&num=3&tbm=isch';

  function getMeSomeDogs(dogsURL){
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

          dogs.each(function(i, n){
            dogsList.push(n.src);
          });

          resolve(dogsList);
        }
      });
    });
  }



  function getImageSize(url){
    return new Promise(function(resolve, reject){
      var size = createImageSizeStream();

      size.on('size', function(dimensions) {
        resolve(dimensions);
        request.abort();
      }).on('error', function(err) {
        reject(err);
      });

      var request = http.get(url, function(response) {
        response.pipe(size);
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


  function getImages(list){
    return new Promise(function(resolve, reject){
      
      var imageCollection = [];
            
      list.forEach(function (url, index){
        // console.log(index, url);
        
        getImage(url).then(function(image){
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

      resolve(image.size);
      // console.log(ary);

      var charWidth = 80
      , charRamp = (" .'`^\",:;Il!i><~+_-?][}{1)(|\\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$")
      , charRampLen = charRamp.length
      , colorChannels = 3
      , valuesPerChannel = 255
      , maxRGB = colorChannels*valuesPerChannel  
      , rampRatio = charRampLen/(maxRGB+1)
      , pixels = image.pixels
      ;

      var aspectRatio = image.size.width/charWidth
        , ascii = ''
        , thisColor
        , closestColor
        , i
        , x
        , y
        , charHeight = image.size.height / aspectRatio
        ;

      for (y = 0; y < charHeight; y+=2) {
        for (x = 0; x < charWidth; x+=1) {


          var idx = image.size.width  * parseInt(y*aspectRatio) + parseInt(x*aspectRatio)
            , currentPixel = pixels[idx]
            , r = currentPixel.r
            , g = currentPixel.b
            , b = currentPixel.b
            , brightness = r+g+b
            ;  

          ascii += charRamp[parseInt(rampRatio*brightness)];
        }
        ascii += '\n';
      }
      console.log(ascii);
    });
  }


  getMeSomeDogs(dawgsURL)
  .then(getImages)
  .then(function(images){
    images.forEach(function(image){
      asciify(image);
    });
  })
  .catch(function(err){
    console.log('ERR: ', err)
  })
  ;





