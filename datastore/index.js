const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  exports.readOne(id, (err, data) => {
    if (!data) {
      callback(err, null);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        callback(null, text);
      });
    }
  });
};

exports.delete = (id, callback) => {
  exports.readOne(id, (err, data) => {
    if (!data) {
      callback(err, null);
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        callback();
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};