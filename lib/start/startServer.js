const chokidar = require('chokidar');
const path = require('path');
const cp = require('child_process');
const { getConfigFile } = require('../utils/index');
const log = require('../utils/log');

let child;

function runServer(arg = {}) {
  const { config = '' } = arg;
  // 启动webpack服务

  // RPC  remote process communicate(远程的进程通信)
  const scriptPath = path.resolve(__dirname, './DevService.js');
  // fork只能在js脚本中才能进行通信
  child = cp.fork(scriptPath, ['--port 8081', `--config ${config}`]);

  child.on('exit', code => {
    if (code) {
      process.exit(code)
    }
  })
}

function onChange() {
  log.verbose('onChange', 'config file changed')
  child.kill();
  runServer();
}

function runWatcher() {
  // 启动配置监听服务
  const configPath = getConfigFile();
  const wather = chokidar.watch(configPath)
    .on('change', onChange)
    .on('error', error => {
      console.error('file watch error:' + error);
      process.exit(1); // 1: 错误退出，0：正常退出
    })
}

module.exports = function(opts, cmd) {
  // 1、通过子进程启动webpack-dev-server服务
  // 1.1、子进程启动可以避免主进程受到影响
  // 1.2、子进程启动可以方便重启，解决配置修改后无法重启
  runServer(opts);

  // 2、监听配置修改
  runWatcher(opts);
}