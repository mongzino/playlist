import getUserInput from "./userInput.js";

export async function login(client) {
    while(true){
    // 사용자로부터 아이디와 비밀번호를 입력받습니다.
    console.log("아이디를 입력하세요:");
    let id = await getUserInput();
    console.log("비밀번호를 입력하세요:");
    let password = await getUserInput();

    // MongoDB에 로그인을 수행합니다.
    const database = client.db('PlaylistDB'); // 사용할 데이터베이스 이름
    const collection = database.collection('user'); // 사용할 컬렉션 이름

    const query = { _id: id, password: password }; // _id와 password 필드를 사용하여 문서를 조회

    const user = await collection.findOne(query);

    if (user) {
        console.log(`로그인에 성공했습니다, ${user.name}님 환영합니다.`);
        return true
    } else {
        console.clear()
        console.log("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
}
}
