import { MongoClient } from "mongodb";
import getUserInput from "./userInput.js";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);

// 계정 삭제
export async function withdraw() {
    let continueWithdrawing = true;

    while (continueWithdrawing) {
        try {
            console.log('탈퇴할 계정의 _id를 입력하세요 (종료하려면 "exit"를 입력하세요): ');
            let input = await getUserInput();

            if (input.toLowerCase() === 'exit') {
                console.log('종료합니다.');
                await wait(500);
                console.clear();
                break; // 루프 종료
            }

            const userId = parseInt(input);

            const result = await client
                .db("PlaylistDB")
                .collection("user")
                .deleteOne({ _id: userId }); // 정수형 _id를 사용하여 삭제

            if (result.deletedCount === 1) {
                console.log(`_id가 ${userId}인 계정이 삭제되었습니다.`);
                await wait(1000);
                console.clear();
            } else {
                console.log(`_id가 ${userId}인 계정을 찾을 수 없습니다.`);
                await wait(700);
                console.clear();
            }
        } catch(e) {
            console.log('작업 실패:', e.message);
        }
    }
}
// withdraw();

// 프로필 뮤직 업데이트
export async function profileMusic() {
    try {
        const database = client.db("PlaylistDB");
        const collection = database.collection("user");

        let continueUpdating = true;

        while (continueUpdating) {
            // 사용자로부터 _id 입력 받기
            // console.log('프로필 뮤직 설정 메뉴입니다')
            console.log('업데이트할 회원의 _id를 입력하세요 (중단하려면 "exit"를 입력하세요): ');
            const userIdInput = await getUserInput();
            
            // 종료 확인
            if (userIdInput.toLowerCase() === 'exit') {
                console.log('종료합니다.');
                await wait(500);
                console.clear();
                break; // 루프 종료
            }

            // userId를 정수형으로 변환
            const userId = parseInt(userIdInput);

            // 업데이트할 프로필 뮤직 입력 받기
            console.log('업데이트할 프로필 뮤직을 입력하세요: ');
            const musicInfo = await getUserInput();

            // MongoDB 업데이트 쿼리 실행
            const result = await collection.updateOne({ _id: userId }, { $set: { profileMusic: musicInfo } });

            // 업데이트 결과 출력
            if (result.modifiedCount > 0) {
                console.log(`프로필 뮤직이 '${musicInfo}'(으)로 업데이트되었습니다.`);
                await wait(1000);
                console.clear();
            } else {
                console.log('일치하는 회원이 없습니다.');
            }
        }
    } catch (error) {
        console.error('작업 실패:', error);
    }
}

// profileMusic();

// 선호 장르 업데이트
export async function favoriteGenre() {
    try {
        const database = client.db("PlaylistDB");
        const collection = database.collection("user");

        let continueUpdating = true;

        while (continueUpdating) {
            // 사용자로부터 _id 입력 받기
            // console.log('선호장르 설정 메뉴입니다')
            console.log('업데이트할 회원의 _id를 입력하세요 (중단하려면 "exit"를 입력하세요): ');
            const userIdInput = await getUserInput();
            
            // 종료 확인
            if (userIdInput.toLowerCase() === 'exit') {
                console.log('종료합니다.');
                await wait(500);
                console.clear();
                break; // 루프 종료
            }

            // userId를 정수형으로 변환
            const userId = parseInt(userIdInput);

            // 업데이트할 프로필 뮤직 입력 받기
            console.log('업데이트할 선호 장르를 입력하세요: ');
            const genreInfo = await getUserInput();

            // MongoDB 업데이트 쿼리 실행
            const result = await collection.updateOne({ _id: userId }, { $set: { favoriteGenre: genreInfo } });

            // 업데이트 결과 출력
            if (result.modifiedCount > 0) {
                console.log(`프로필 뮤직이 '${genreInfo}'(으)로 업데이트되었습니다.`);
                await wait(1000);
                console.clear();
            } else {
                console.log('일치하는 회원이 없습니다.');
            }
        }
    } catch (error) {
        console.error('작업 실패:', error);
    }
}

// favoriteGenre();


const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));