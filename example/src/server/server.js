import Express from 'express';
import Webpack from 'webpack';
import WebpackConfig from '../../webpack.config.dev';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebPackHotMiddleware from 'webpack-hot-middleware';

// server side rendering
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, createMemoryHistory, RouterContext} from 'react-router';
import { Provider } from 'react-redux';
import routes from '../universal/routes';
import createStore from '../universal/redux/store';

const PORT = 3000;
const app = Express();

// create a webpack instance from our dev config
const webpackCompiler = Webpack(WebpackConfig);

app.use('/dist2', Express.static('dist2'));

// Use webpack dev middleware to bundle our universal on the fly and serve it
// on publicPath. Turn off verbose webpack output in our server console
// by setting noInfo: true
app.use(WebpackDevMiddleware(webpackCompiler, {
  publicPath: WebpackConfig.output.publicPath,
  noInfo: true
}));

// instruct our webpack instance to use webpack hot middleware
app.use(WebPackHotMiddleware(webpackCompiler));

// NOTE: delete express static middleware for dist. We don't need that
// anymore because webpack-dev-middleware serves our bundle.js from memory

app.use((req, res) => {
  const html = `<!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>ld-redux Demo</title>
                        <script type="module">
                            import hot from './dist2/hot.js';
                            window.hot = hot;
                        </script>
                      </head>
                      <body>
                        <div id="reactDiv"/>
                        <script type="application/javascript" src="/dist/bundle.js"></script>
                      </body>
                    </html>`;

  res.end(html);
  // const history = createMemoryHistory(req.path);
  // const store = createStore();
  //
  // const matchParams = {
  //   history,
  //   routes,
  //   location: req.originalUrl
  // };
  //
  // match(matchParams, (error, redirectLocation, renderProps) => {
  //   if (error) {
  //     res.status(500).send(error.message);
  //   } else if (redirectLocation) {
  //     res.redirect(302, redirectLocation.pathname + redirectLocation.search);
  //   } else if (renderProps) {
  //     const reactString = renderToString(
  //       <Provider store={store}>
  //         <RouterContext {...renderProps} />
  //       </Provider>
  //     );
  //
  //     const reduxState = store.getState();
  //
  //     const html = `<!DOCTYPE html>
  //                   <html>
  //                     <head>
  //                       <meta charset="utf-8">
  //                       <meta name="viewport" content="width=device-width, initial-scale=1">
  //                       <title>ld-redux Demo</title>
  //                       <script>
  //                           window.__INITIAL_STATE__ = ${JSON.stringify(reduxState)};
  //                       </script>
  //                     </head>
  //                     <body>
  //                       <div id="reactDiv">${reactString}</div>
  //                       <script type="application/javascript" src="/dist/bundle.js"></script>
  //                     </body>
  //                   </html>`;
  //
  //     res.end(html);
  //   } else {
  //     res.status(404).send('Not found');
  //   }
  // });
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});