// import prompt from 'prompt';


// export default async function password(client){
//     prompt.start();
//     prompt.message = '';
//     prompt.delimiter = '';
    
//     const schema = {
//     properties: {
//     password: {
//     description: '비밀번호를 입력하세요',
//     hidden: true,
//     replace: '*'
//     }
//     }
//     };
    
//      prompt.get(schema, function (err, result) {
//         // console.log(result.password)
//         return result.password
//     });
    
// }

// let test=await password()
// console.log(test)



// import prompt from 'prompt';

// export function password() {
//     return new Promise((resolve, reject) => {
//         prompt.start();
//         prompt.message = '';
//         prompt.delimiter = '';

//         const schema = {
//             properties: {
//                 password: {
//                     description: '비밀번호를 입력하세요',
//                     hidden: true,
//                     replace: '*'
//                 }
//             }
//         };

//         prompt.get(schema, function (err, result) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result.password);
//             }
//         });
//     });
// }


// import readlineSync from 'readline-sync';
// import readline from "readline"

// export async function password() {
//     const password = readlineSync.question('비밀번호를 입력하세요: ', {
//         hideEchoBack: true // 입력되는 비밀번호를 *로 가리기
//     });
//     return password;
// }



import readline from 'readline';

export function password() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });

  return new Promise((resolve, reject) => {
    rl.stdoutMuted = true;

    rl.question('비밀번호를 입력하세요: ', (pwd) => {
      resolve(pwd);
      rl.close();
    });

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.stdoutMuted)
        rl.output.write("*");
      else
        rl.output.write(stringToWrite);
    };
  });
}


