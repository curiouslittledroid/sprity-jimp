'use strict';

const Promise = require('bluebird');
const Jimp = require('jimp');

var createImage = (width, height, bgColor) => {
  return new Promise((resolve, reject) => {
    new Jimp(width, height, bgColor, (err, image) => {
      if (!err) {
        resolve(image);
      } else {
        reject(err);
      }
    });
  });
};

var pushImage = (tile, canvas) => {
  return new Promise((resolve, reject) => {
    // merge each image in the big generate image (createImage)
    Jimp.read(tile.path, (err, image) => {
      if (err) {
        reject(err);
      } else {
        canvas.composite(image, tile.x + tile.offset, tile.y + tile.offset, (err, generatedImg) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(generatedImg);
        });
      }
    });
  });
};

var toBuffer = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.getBuffer( Jimp.MIME_PNG, (err, buffer) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        type: 'png',
        mimeType: 'image/png',
        contents: buffer,
        width: canvas.bitmap.width,
        height: canvas.bitmap.height
      });
    });
  });
};

var scaleImage = (base, type, opt) => {
  return new Promise((resolve, reject) => {
    Jimp.read(base, (err, image) => {
      if (err) {
        reject(err);
        return;
      }
      image.scale(opt.scale, function (e, image) {
        if (e) {
          reject(e);
          return;
        }
        resolve(image);
      });
    });
  });
};

module.exports = {
  create: (tiles, opt) => {
    return createImage(opt.width, opt.height, '#fff')
      .then((c) => Promise.map(tiles, tile => pushImage(tile, c), { concurrency: 1 }))
      .then(c => toBuffer(c[0], opt));
  },
  scale: (base, opt) => {
    return scaleImage(base.contents, base.type, opt)
      .then(image => toBuffer(image, opt));
  }
};
