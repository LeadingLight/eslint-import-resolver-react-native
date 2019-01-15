const path = require('path');
const nodeResolve = require( 'eslint-import-resolver-node').resolve;
exports.interfaceVersion = 2;
exports.resolve = resolve;

// Setting
// platform: 'both' || 'ios' || 'android' || 'any'
// default = 'both'
var imageSuffixes = [ '.png', '.jpg', '.gif', '.jpeg' ];
var sizeSuffixes = ['@1x', '@1.5x', '@2x', '@3x', '@3.5x'];

function resolve(source, file, config) {
  let resolve = nodeResolve(source, file, config);
  if (resolve.found) return resolve;

  if (isImage(source)) {
    resolve = checkImages(source, file, config);
    if (resolve.found) return resolve;
  }

  // first try to resolve path as file, then as index in directory, as bundler does
  resolve = resolveByPlatform(source, file, config);
  if (resolve.found) return resolve;

  // not `path.join` because it loses leading `./`
  return resolveByPlatform(source + path.sep + 'index', file, config);
}

function resolveByPlatform(source, file, config) {
  config = config || {};
  const platform = config.platform || 'both';

  if (platform === 'both') return both(source, file, config);
  if (platform === 'any') return any(source, file, config);

  // look for specific platform endings = '.' + platform
  return specific(source, file, config, platform);
}

function isImage(source) {
  var imageFound = false;
  imageSuffixes.forEach(function(suffix) {
    if (source.endsWith(suffix)) {
      imageFound = true;
    }
  })
  return imageFound;
}

function checkImages(source, file, config, platform=null) {
  var splitSource = source.split('.');
  var noSuffix = splitSource.slice(0, -1).join('.');
  var suffix = '.' + splitSource.slice(-1);
  var platformPart = (platform === null ? '' : `.${platform}`);

  for(sizeSuffix of ['', ...sizeSuffixes]) {
    const pathToTry = `${noSuffix}${sizeSuffix}${platformPart}${suffix}`;
    const image = nodeResolve(pathToTry, file, config);
    if(image.found) {
      return image
    }
  }
  return {found: false};
}

function resolvePlatform(source, file, config, platform) {
  if (isImage(source)) {
    return checkImages(source, file, config, platform);
  }
  else {
    return nodeResolve(source + '.' + platform, file, config);
  }
}

function both(source, file, config) {
  // `native` counts as both ios and android.
  const native = resolvePlatform(source, file, config, 'native');
  if (native.found) return {found: true};

  const ios = resolvePlatform(source, file, config, 'ios');
  if (!ios.found) return {found: false};

  const android = resolvePlatform(source, file, config, 'android');
  if (!android.found) return {found: false};

  return ios;
}

function any(source, file, config) {
  const ios = resolvePlatform(source, file, config, 'ios');
  if (ios.found) return ios;

  const android = resolvePlatform(source, file, config, 'android');
  if (android.found) return android;

  const native = resolvePlatform(source, file, config, 'native');
  if (native.found) return native;

  // no platform file found
  return {found: false};
}

function specific(source, file, config, platform) {
  return resolvePlatform(source, file, config, platform);
}
