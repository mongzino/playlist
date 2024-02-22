import { MongoClient } from "mongodb";
import getUserInput from "./userInput.js";



async function main(){
    const uri = process.env.DB_URL;
    const client = new MongoClient(uri);

    while(true){
        console.log(`마이페이지 - 1.플레이리스트 관리 2.내 정보 관리 3.뒤로가기`);
        let menu = await getUserInput();
        if(menu==='1') {
            console.log('내 플레이리스트 관리하기>');
            let title = await getUserInput();
        }else if(menu==='2'){
            while(true) {
                console.log('내정보 관리 - 1.회원 탈퇴 2.프로필 뮤직 설정 3.선호 장르 설정 4.뒤로가기');
                let user = await getUserInput();
                if(user==='1'){
                    console.log(`회원 탈퇴 하시겠습니까`)
                }else if(user==='2'){
                    console.log(`프로필 뮤직 설정 화면입니다`)
                }else if(user==='3'){
                    console.log(`선호 장르 설정 화면입니다`)
                }else if(user==='4'){
                    console.log(`뒤로가기`)
                    await wait(500);
                    console.clear();
                    break;
                }else{
                    console.log('잘못된 입력입니다.');
                    await wait(500);
                    console.clear();
                }
            }
        }else if(menu==='3'){
            console.log(`뒤로가기`);
            await wait(500);
            console.clear();
            break;
        }else{
            console.log('잘못된 입력입니다.');
            await wait(500);
            console.clear();
        }
    }
}

main();

const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));