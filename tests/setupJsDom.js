import {jsdom} from 'jsdom';

export const setupDom = () => {
  // setup the simplest document possible
  const doc = jsdom('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
  });

  // get the window object out of the document
  const win = doc.defaultView;

  // set globals for mocha that make access to document and window feel
  // natural in the test environment
  global.document = doc;
  global.window = win;

  global.window.requestAnimationFrame = (cb) => setTimeout(cb, 1);

  global.navigator = {
    userAgent: 'node.js',
  };
};
