## 脚手架开发流程
  + package.josn 中添加bin,bin是一个对象
  ```
  "bin": {
    "weite-ls": "./bin/index.js"
  }
  ```
  + bin->index.js文件中首行添加执行语言
  ```
  #!/usr/bin/env node
  ```
  + 本地调试方法
  ```
  npm link
  ```
## startServer 服务开发流程
  + 通过子进程启动webpack-dev-server服务(runServer)
    + 子进程启动可以避免主进程受阻
    + 子进程启动可以方便重启，解决配置修改后无法重启
    ```
    // 方法1
    cp.execFile('node', [path.resolve(__dirname, './DevService.js'), '--force'], {}, (err, stdout) => {
      if (!err) {
        console.log(stdout);
      } else {
        console.log(err)
      }
    });
    // 方法2 有风险
    cp.exec(`node ${path.resolve(__dirname, './DevService.js')} --force`, (err, stdout) => {
      if(!err) {
        console.log(stdout)
      } else {
        console.log(err)
      }
    } )
    // 方法3
    const buffer = cp.execSync(`node ${path.resolve(__dirname, './DevService.js')} --force`);
    console.log(buffer.toString())
    // 方法4 真正的底层方法，没有回调(创建了一个子进程，然后在子进程里加入一些参数信息，最后返回这个子进程)
    const child = cp.spawn('node', [path.resolve(__dirname, './DevService.js'), '--force']);
    child.stdout.on('data', function(data) {
      console.log('stdout');
      console.log(data.toString())
    })
    child.stderr.on('data', (data) => {
      console.log('stderr');
      console.log(data.toString())
    })
    child.stdout.on('error', (err) => {
      console.log('error');
      console.log(err.toString())
    })
    // // 监听关闭进程
    child.stdout.on('close', (code) => {
      console.log('close');
      console.log(code)
      // process.exit(0)
    })
    ```
    + 进程之前的数据通信
    ```
    // RPC  remote process communicate(远程的进程通信)
    const scriptPath = path.resolve(__dirname, './DevService.js');
    // fork只能在js脚本中才能进行通信
    const child = cp.fork(scriptPath, ['--port 8080']);
    child.on('data', (data) => {
      console.log(data.toString())
    })
    child.on('message', data => {
      // 接收来自子进程的消息
      console.log('message from child process1');
      console.log(data)
    })
    child.send('hello child process')

    // DevService.js
    process.on('message', data => {
      console.log('message from main process');
      console.log(data)
    })
    process.send('hello main process');
    ```
  + 监听配置修改 （runWatcher）

## 源码分析
  #### node 文件监听chokidar库

  #### node 启动子进程 child_process 库

  #### detect-port库源码分析

   + 运用到两个核心库net,address(对地址进行校验的库)
   + detectPort的实现关系到node的网络是如何实现的
   + detectPort是通过tcp链接去帮助我们去判断这个端口号是否被占用
   + 总结
    + 利用net创建了一个tcp服务对端口号进行调用，同时判断最大端口号+10是否超出最大端口号，
    + 调用listen方法判断端口号是否被占用；listen是通过port和hostname进行判断，如果第一次没有传hostname成功之后，会继续监听本地 0.0.0.0 是否可以成功，成功之后会继续看locahost是否可以成功，成功之后再看address.ip(); 都成功之后才会被认为可用；失败的话会调用 handleError ，拿到当前端口号重新加 1 后再去执行 tryListen 方法重头来

  #### node 内置 net 库

  #### 命令行交互实现 inquirer