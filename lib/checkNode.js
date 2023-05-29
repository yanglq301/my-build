const semver = require('semver'); // 校验version版本

module.exports = function checkNode(minNodeVersion) {
  // 校验version的有效性
  // 获取node版本号
  const nodeVersion = semver.valid(semver.coerce(process.version));
  return semver.satisfies(nodeVersion, '>=' + minNodeVersion);
}