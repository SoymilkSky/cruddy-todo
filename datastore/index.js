const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      callback(err, { id, text });
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, data) => {
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (!fileData) {
      callback(err, null);
    } else {
      callback(null, {id, text: fileData.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  if (exports.readAll) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      callback(null, text);
    });
  }
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
