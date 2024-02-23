import readline from "readline";

// input과 output을 사용하기 위해서 다음과 같이 정의
readline.Interface.setMaxListeners(100);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,

});

export default function getUserInput() {
  return new Promise((resolve, reject) => {
    // 첫번째 인자 : "close","line" 등
    rl.on("line", (line) => {
      resolve(line);
    });
    // .on('close',()=>{
    //     process.exit();
    // });
  });
}

export function password(rl) {
  return new Promise((resolve, reject) => {
    rl.stdoutMuted = true;

    const originalWriteToOutput = rl._writeToOutput;
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.stdoutMuted)
        rl.output.write("*");
      else
        rl.output.write(stringToWrite);
    };

    rl.question('비밀번호를 입력하세요: ', (pwd) => {
      rl.stdoutMuted = false;
      rl._writeToOutput = originalWriteToOutput;
      resolve(pwd);
    });
  });
}
