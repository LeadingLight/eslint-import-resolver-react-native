import assert from 'assert';
import fs from 'fs';
import { resolve } from '../';

const FILE = __filename;

const assertIsValidPath = (path) => {
  assert.ok(fs.existsSync(path), `path invalid: ${path}`);
}

const baseTest = (path, extension) => {
  const testBoth = (config) => {
    it('should return success when both platforms files are found', function() {
      const result = resolve(`./${path}/both${extension}`, FILE, config);
      assert.equal(true, result.found);
      assertIsValidPath(result.path);
    });

    it('should return false when any of the platforms files isn\'t found',
      function() {
        let result = resolve(`./${path}/bothFail1${extension}`, FILE, config);
        assert.equal(false, result.found);
        result = resolve(`./${path}/bothFail2${extension}`, FILE, config);
        assert.equal(false, result.found);
      }
    );
  }
  describe('default behaviour: both', () => testBoth(undefined));
  describe('platform: both', () => testBoth({platform: 'both'}));

  describe('platform: any', function() {
    const config = {platform: 'any'};
    it('should return success if any of the platforms is found', function() {
      let result = resolve(`./${path}/any1${extension}`, FILE, config);
      assert.equal(true, result.found);
      assertIsValidPath(result.path);

      result = resolve(`./${path}/any2${extension}`, FILE, config);
      assert.equal(true, result.found);
      assertIsValidPath(result.path);

      result = resolve(`./${path}/both${extension}`, FILE, config);
      assert.equal(true, result.found);
      assertIsValidPath(result.path);
    });

    it('should return false if none of the platforms is found', function() {
      const result = resolve(`./${path}/nofile${extension}`, FILE, config);
      assert.equal(false, result.found);
    });
  });

  describe('platform: specific', function() {
    it('should return success if the specific platform is found', function() {
      let config = {platform: 'android'};
      let result = resolve(`./${path}/any1${extension}`, FILE, config);
      assert.equal(true, result.found);
      assertIsValidPath(result.path);

      config = {platform: 'ios'};
      result = resolve(`./${path}/any2${extension}`, FILE, config);
      assert.equal(true, result.found);
      assertIsValidPath(result.path);
    });

    it('should return false if the specific platform isn\'t found', function() {
      let config = {platform: 'android'};
      let result = resolve(`./${path}/any2${extension}`, FILE, config);
      assert.equal(false, result.found);

      config = {platform: 'ios'};
      result = resolve(`./${path}/any1${extension}`, FILE, config);
      assert.equal(false, result.found);
    });
  });

}

describe('JS files', function() {
  baseTest('js', '');

  describe('index file in directory, both platforms', function() {
    const config = {platform: 'both'};

    it('should return success when both platforms files are found', function() {
      const result = resolve('./js/dirByIndex', FILE, config);
      assert.equal(true, result.found);
      assertIsValidPath(result.path);
    });

    it('should return false when any of the platforms files isn\'t found', function() {
      let result = resolve('./js/dirByIndexFail1', FILE, config);
      assert.equal(false, result.found);
      result = resolve('./js/dirByIndexFail2', FILE, config);
      assert.equal(false, result.found);
    });
  });
});

describe('Image files', function() {
  baseTest('img', '.gif');

  describe('size suffix', function() {
    it('should recognize valid size suffixes', function() {
      const result = resolve('./img/img.gif', FILE, {});
      assert.equal(true, result.found);
      assertIsValidPath(result.path);
    });

    it('shouldn\'t recognize invalid size suffixes', function() {
      const result = resolve('./img/imgFail.gif', FILE, {});
      assert.equal(false, result.found);
    });
  });

  describe('size suffix and platform', function() {
    it('should recognize variations on platform and size at the same time',
      function() {
        const source = './img/sizeAndPlatform.gif';
        let result = resolve(source, FILE, {platform: 'both'});
        assert.equal(true, result.found);
        assertIsValidPath(result.path);

        result = resolve(source, FILE, {platform: 'any'});
        assert.equal(true, result.found);
        assertIsValidPath(result.path);

        result = resolve(source, FILE, {platform: 'android'});
        assert.equal(true, result.found);
        assertIsValidPath(result.path);

        result = resolve(source, FILE, {platform: 'ios'});
        assert.equal(true, result.found);
        assertIsValidPath(result.path);
      }
    );
  });
});
