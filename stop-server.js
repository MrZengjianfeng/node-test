const { exec } = require('child_process');
const os = require('os');

function stopServer() {
  console.log('正在停止 Node.js 服务...');
  
  if (os.platform() === 'win32') {
    // Windows 系统
    exec('taskkill /f /im node.exe', (error, stdout, stderr) => {
      if (error) {
        console.log('没有找到运行中的 Node.js 进程或进程已停止');
        return;
      }
      console.log('Node.js 服务已停止');
    });
  } else {
    // Unix/Linux/MacOS 系统
    exec('pkill -f node', (error, stdout, stderr) => {
      if (error) {
        console.log('没有找到运行中的 Node.js 进程或进程已停止');
        return;
      }
      console.log('Node.js 服务已停止');
    });
  }
}

stopServer();