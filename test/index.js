'use strict';

var fs = require('fs');
var should = require('chai').should();
var Jimp = require('jimp');

require('mocha');

var jimpProc = require('../index');

var tiles = [{
  height: 128,
  width: 128,
  x: 0,
  y: 0,
  offset: 4,
  path: './test/fixtures/png.png'
}, {
  height: 128,
  width: 128,
  x: 0,
  y: 136,
  offset: 4,
  path: './test/fixtures/png.png'
}];

describe('sprity-jimp', function () {
  it('should return a png image buffer', function (done) {
    jimpProc.create(tiles, {
      width: 520,
      height: 656,
      bgColor: [0, 0, 0, 0],
      options: {}
    }).then(function (image) {
      image.should.have.property('width', 520);
      image.should.have.property('height', 656);
      image.should.have.property('contents');
      done();
    });
  });

  it('should return a resized png image', function (done) {
    jimpProc.scale({
      contents: './test/expected/image.png',
      width: 136,
      height: 264
    }, {
      scale: 0.5,
      width: 136 / 2,
      height: 264 / 2,
      type: 'png',
      options: {}
    }).then(function (image) {
      image.should.have.property('type', 'png');
      image.should.have.property('mimeType', 'image/png');
      image.should.have.property('width', 68);
      image.should.have.property('height', 132);
      image.should.have.property('contents');
      done();
    });
  });
});
