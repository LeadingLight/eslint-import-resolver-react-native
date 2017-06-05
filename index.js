const nodeResolve = require( 'eslint-import-resolver-node').resolve;
exports.interfaceVersion = 2;
exports.resolve = resolve;

// Setting
// platform: 'both' || 'ios' || 'android' || 'any'
// default = 'both'
var imageSuffixes = [ '.png', '.jpg', '.gif', '.jpeg' ];

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

function isImage(source) {
  var imageFound = false;
  imageSuffixes.forEach(function(suffix) {
    if (source.endsWith(suffix)) {
      imageFound = true;
    }
  })
  return imageFound;
}

function checkImages(source, file, config) {
  console.log ('is image')
  if (isImage(source)) {
    var splitSource = source.split('.');
    var noSuffix = splitSource.slice(0, -1).join('.');
    var suffix = '.' + splitSource.slice(-1);
    const img1 = nodeResolve(noSuffix + '@1x' + suffix, file, config);
    const img2 = nodeResolve(noSuffix + '@1.5' + suffix, file, config);
    const img3 = nodeResolve(noSuffix + '@2x' + suffix, file, config);
    const img4 = nodeResolve(noSuffix + '@3x' + suffix, file, config);
    const img5 = nodeResolve(noSuffix + '@3.5x' + suffix , file, config);

    if (img1.found) return img1;
    if (img2.found) return img2;
    if (img3.found) return img3;
    if (img4.found) return img4;
    if (img5.found) return img5;

    return {found: false};
  }
}

function both(source, file, config) {
  if (isImage(source)) {
    return checkImages(source, file, config);
  }

  const ios = nodeResolve(source+'.ios', file, config);

  if (!ios.found) return {found: false};

  const android = nodeResolve(source+'.android', file, config);
  if (!android.found) return {found: false};

  return ios;
}

function any(source, file, config) {
  if (isImage(source)) {
    return checkImages(source, file, config);
  }

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
