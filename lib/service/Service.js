const path = require('path');
const fs = require('fs');
const log = require('../utils/log');
const { getConfigFile } = require('../utils/index');

class Service {
  constructor(opts) {
    this.args = opts;
    this.config = {};
    this.hooks = {};
    this.dir = process.cwd();
  }
  async start () {
    this.resolveConfig();
  }

  resolveConfig() {
    const { config = '' } = this.args;
    let configFilePath = '';
    if (config) {
      if (path.isAbsolute(config)) {
        configFilePath = config;
      } else {
        configFilePath = path.resolve(config);
      }
      log.verbose('configFilePath', configFilePath)
    } else {
      configFilePath = getConfigFile();
    }
    if (configFilePath && fs.existsSync(configFilePath)) {
      this.config = require(configFilePath);
      log.verbose('config', this.config);
    } else {
      log.verbose('配置文件不存在，终止执行')
      process.exit(1)
    }
  }
}

module.exports = Service;