// throw new Error('111')
const detectPort = require('detect-port');
const inquirer = require('inquirer');
const Service = require('../service/Service');

(async function(){
  const DEFAULT_PORT = 8000;
  const params = process.argv.slice(2);
  const paramsObj = {};
  params.forEach(param => {
    const paramsArr = param.split(' ');
    paramsObj[paramsArr[0].replace('--', '')] = paramsArr[1];
  })
  // console.log(paramsObj)

  const { config = '' } = paramsObj;
  let defaultPort = paramsObj['port'] || DEFAULT_PORT;
  defaultPort = parseInt(defaultPort, 10);

  try {
    // detectPort的实现关系到node的网络是如何实现的
    // detectPort是通过tcp链接去帮助我们去判断这个端口号是否被占用
    const newPort = await detectPort(defaultPort);
    if(newPort === defaultPort) {
      // console.log(`端口号${defaultPort}可以使用`)
    } else {
      // 命令行交互
      const questions = {
        type: 'confirm',
        name: 'answer',
        message: `${defaultPort}已被占用，是否启用新端口号${newPort}`
      }
      const answer = (await inquirer.prompt(questions)).answer;
      if (!answer) {
        process.exit(1);
      }
    }
    process.env.NODE_ENV = 'development';
    const args = {
      port: newPort,
      config,
    }
    const service = new Service(args);
    service.start();
  } catch(err) {
    console.log(err.message);
  }
})()


// 判断端口号是否被占用  detect-port
