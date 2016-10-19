const nodeResolve = require( 'eslint-import-resolver-node').resolve;
exports.interfaceVersion = 2;
exports.resolve = resolve;

// Setting
// platform: 'both' || 'ios' || 'android' || 'any'
// default = 'both'

function resolve(source, file, config) {
  let resolve = nodeResolve(source, file, config);
  if (resolve.found) return resolve;

  config = config || {};
  const platform = config.platform || 'both';

  if (platform === 'both') return both(source, file, config);
  if (platform === 'any') return any(source, file, config);

  // look for specific platform endings = '.' + platform
  return specific(source, file, config, platform);
}


function both(source, file, config) {
  const ios = nodeResolve(source+'.ios', file, config);
  if (!ios.found) return {found: false};

  const android = nodeResolve(source+'.android', file, config);
  if (!android.found) return {found: false};

  return ios;
}

function any(source, file, config) {
  const ios = nodeResolve(source+'.ios', file, config);
  if (ios.found) return ios;

  const android = nodeResolve(source+'.android', file, config);
  if (android.found) return android;

  // no platform file found
  return {found: false};
}

function specific(source, file, config, platform) {
  return nodeResolve(source + '.' + platform, file, config);
}
