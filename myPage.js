const { MongoClient } = require('mongodb');
const Input = require("./userInput");



async function main(){
    const uri = process.env.DB_ATLAS_URL;
    const client = new MongoClient(uri);

    while(true){
        console.log(`마이페이지 - 1.플레이리스트 관리 2.내 정보 관리 3.뒤로가기`);
        let menu = await Input.getUserInput();
        if(menu==='1') {
            console.log('내 플레이리스트 관리하기>');
            let title = await Input.getUserInput();
        }else if(menu==='2'){
            while(true) {
                console.log('내정보 관리 - 1.회원 탈퇴 2.프로필 뮤직 설정 3.선호 장르 설정 4.뒤로가기');
                let user = await Input.getUserInput();
                if(menu==='1'){
                    console.log(`회원 탈퇴 하시겠습니까`)
                }else if(menu==='2'){
                    console.log(`프로필 뮤직 설정 화면입니다`)
                }else if(menu==='3'){
                    console.log(`선호 장르 설정 화면입니다`)
                }else if(menu==='4'){
                    console.log(`뒤로가기`)
                    await wait(500);
                    process.exit();
                }else{
                    console.log('잘못된 입력입니다.');
                    return;
                }
            }
        }else if(menu==='3'){
            console.log(`뒤로가기`);
            await wait(500);
            process.exit();
        }else{
            console.log('잘못된 입력입니다.');
            return;
        }
    }
}

main();

const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));