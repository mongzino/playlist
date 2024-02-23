import { MongoClient } from "mongodb";
import getInput from "./userInput.js";
import getUserInput from "./userInput.js";
import ckName, { ckId,ckPassword,updateGenre,createAccount } from "./signUp.js";
import {login} from "./login.js"



const uri = process.env.DB_URL;
const client = new MongoClient(uri);

async function main() {
    try{
        while(true){
            console.log("치타 뮤직에 오신 것을 환영합니다")
            console.log("1.회원 가입   2.로그인   3.프로그램 종료")
            let mainInput=await getUserInput()
            
            if(mainInput==1)
            {
                console.log("회원가입")
                let name=await ckName(client)
                let id=await ckId(client)
                let password=await ckPassword(client)
                if(name && id && password){
                    
                    console.log(`계정생성 되었습니다 환영합니다 ${name}님`)
                    await createAccount(client,name,id,password)
                    await updateGenre(client,id)
                }


            }
            else if(mainInput==2)
            {
                console.log("로그인")
                await login(client);
                while(true){
                console.log("1.검색하기 2.마이페이지 3.로그아웃")
                let Umenu=await getUserInput()
                if (Umenu==1)
                {

                }
                else if(Umenu==2)
                {
                    
                }
                else if(Umenu==3)
                {
                    console.log("\n로그아웃 합니다")
                    break
                }
                }
            }
            else if(mainInput==3)
            {
                console.log("프로그램을 종료합니다.")
                process.exit()
            }
            else
            {
                console.log("해당하는 번호가 아닙니다.")
            }

            console.log("\n메인 메뉴로 넘어가려면 엔터를 입력하세요")
            await getUserInput()
            console.clear()
            
        }
    }catch(e){console.error}finally{await client.close()}
    }

main();

export default client;
