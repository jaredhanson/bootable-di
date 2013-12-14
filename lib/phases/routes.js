/**
 * Module dependencies.
 */
var scripts = require('scripts')
  , path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // node <=0.6
  , debug = require('debug')('bootable-di');

var ioc;
try {
  ioc = require('electrolyte');
} catch (_) {
  // workaround when `npm link`'ed for development
  var prequire = require('parent-require');
  ioc = prequire('electrolyte');
}


/**
 * Route drawing phase.
 *
 * This phase will `require` a routes file, allowing the application to draw its
 * routes.
 *
 * This phase is typically the last phase before instructing the server to
 * listen.  Any initializers should be run prior to drawing routes, ensuring
 * that the application is fully prepared to handle requests.
 *
 * Examples:
 *
 *   app.phase(bootable.routes('routes.js'));
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(options) {
  if ('string' == typeof options) {
    options = { filename: options };
  }
  options = options || {};
  var filename = options.filename || 'routes'
    , extensions = options.extensions;
  
  return function routes() {
    var script = scripts.resolve(path.resolve(filename), extensions);
    if (!existsSync(script)) { return; }
    
    var mod = require(script);
    var deps = mod['@require'] || []
      , args = [];
    
    for (var i = 0, len = deps.length; i < len; ++i) {
      debug('create %s', deps[i]);
      var inst = ioc.create(deps[i], this);
      args.push(inst);
    }
    
    mod.apply(this, args);
  };
};
