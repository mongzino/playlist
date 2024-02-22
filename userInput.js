import readline from "readline";

// input과 output을 사용하기 위해서 다음과 같이 정의
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
