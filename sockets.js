// creates sockets.js Router

'use strict';

exports = module.exports = function(app) {
  app.io.sockets.on('connection', function(socket){
    socket.on('/about/#join', require('./events/about/index').join(app,socket));
    socket.on('/about/#send', require('./events/about/index').send(app,socket));
  });
};