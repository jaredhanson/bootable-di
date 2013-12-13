/* global describe, it, expect */

var pkg = require('..');

describe('bootable-ioc', function() {
  
  it('should export object', function() {
    expect(pkg).to.be.an('object');
  });
  
});
