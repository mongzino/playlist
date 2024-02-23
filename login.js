import getUserInput from "./userInput.js";
import chalk from "chalk";

export async function login(client) {
    while(true){
    // 사용자로부터 아이디와 비밀번호를 입력받습니다.
    console.log(chalk.bgWhiteBright("이름을 입력하세요"));
    let name = await getUserInput();
    console.log(chalk.bgWhiteBright("비밀번호를 입력하세요"));
    let password = await getUserInput();

    // MongoDB에 로그인을 수행합니다.
    const database = client.db('PlaylistDB'); // 사용할 데이터베이스 이름
    const collection = database.collection('user'); // 사용할 컬렉션 이름

    const query = { name: name, password: password }; // _id와 password 필드를 사용하여 문서를 조회

    const user = await collection.findOne(query);

    if (user) {
        console.log(chalk.bgCyan(`로그인에 성공했습니다, ${user.name}님 환영합니다.`));
        // 로그인 성공시 id값이 리턴 (다른 함수에서 사용 필요)
        return user._id
    } else {
        console.clear()
        console.log(chalk.cyan("아이디 또는 비밀번호가 일치하지 않습니다."));
        return false
    }
}
}
