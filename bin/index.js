#!/usr/bin/env node
checkDebug(); // node执行机制导致process.env.LOG_LEVEL必须提前
const { program } = require('commander');
const pkg = require('../package.json');
const checkNode = require('../lib/checkNode');
const startServer = require('../lib/start/startServer');
const buildServer = require('../lib/build/buildServer');

const MIN_NODE_VERSION = "8.9.0";

function checkDebug() {
  if (process.argv.indexOf('--debug') !== -1 || process.argv.indexOf('-d') !== -1) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
}

(async () => {
  try {
    if (!checkNode(MIN_NODE_VERSION)) {
      throw new Error('please upgrade your node version to v' + MIN_NODE_VERSION);
    }

    program.version(pkg.version);

    program
      .command('start')
      .option('--config <config>', '配置文件路径')
      .description('start project by my-build')
      .allowUnknownOption()
      .action(startServer);

    program
      .command('build')
      .option('-c --config <config>', '配置文件路径')
      .description('build project by my-build')
      .allowUnknownOption()
      .action(buildServer)

    program
     .option('-d, --debug', '开启调试模式')
     .hook('preAction', ((thisCommand, actionCommand) => {
      const { debug = false } = actionCommand.optsWithGlobals();
      if (debug) {
        process.env.LOG_LEVEL = 'verbose';
      } else {
        process.env.LOG_LEVEL = 'info';
      }
     }))

    program.parse(process.argv);
  } catch (e) {
    console.log(e.message)
  }
  
})();