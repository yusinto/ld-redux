'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var setFlags = exports.setFlags = function setFlags(flags) {
  return {
    type: 'SET_FLAGS',
    data: flags
  };
};