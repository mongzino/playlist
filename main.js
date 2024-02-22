import { MongoClient } from "mongodb";
import getInput from "userInput";
import getUserInput from "./userInput";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);

async function main() {
    while(true){
        console.log("치타 뮤직에 오신 것을 환영합니다")
        console.log("1.회원 가입   2.로그인   3.프로그램 종료")
        let mainInput=await getUserInput()
        console.log(mainInput)
    }
}

main();

export default client;
