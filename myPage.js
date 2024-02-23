import { MongoClient } from "mongodb";
import getUserInput from "./userInput.js";
import { create, find, modify, remove } from "./myPlaylist.js";
import { withdraw, profileMusic, favoriteGenre } from "./myInfo.js"; 
// 수정
async function main(client, user_id) {
  while (true) {
    console.log(`마이페이지 - 1.플레이리스트 관리 2.내 정보 관리 3.뒤로가기`);
    let menu = await getUserInput();
    // 플레이리스트 관리
    if (menu === "1") {
      // 사용자 정보 불러오기
      const userInfo = await client
        .db("PlaylistDB")
        .collection("user")
        .findOne({ _id: user_id });

      while (true) {
        console.clear();
        // 내 플레이리스트 목록 보여주기
        const playlist = await client
          .db("PlaylistDB")
          .collection("playlist")
          .find({ owner: user_id })
          .toArray();
        await playlist.forEach((pl) => {
          pl.owner = userInfo.name;
        });
        console.table(playlist, ["owner", "title", "description", "views"]);
        // 메뉴 선택
        console.log(
          "플레이리스트 관리 - 1: 플레이리스트 생성 2: 플레이리스트 조회 3: 플레이리스트 수정 4: 플레이리스트 삭제 5: 뒤로가기"
        );
        let pl_menu = parseInt(await getUserInput());
        if (pl_menu === 1) {
          // 플레이리스트 생성 함수
          await create(client, user_id);
        } else if (pl_menu === 2) {
          // 선택한 플레이리스트의 수록곡 조회 함수
          await find(client, playlist);
        } else if (pl_menu === 3) {
          // 선택한 플레이리스트 수정 함수
          await modify(client, playlist);
        } else if (pl_menu === 4) {
          // 내 플레이리스트 목록 보여주는 함수
          await remove(client, playlist);
        } else if (pl_menu === 5) {
          console.log("뒤로가기");
          break;
        } else {
          console.log("잘못된 입력입니다. 메뉴를 다시 선택해주세요.");
        }
      }
    } else if (menu === "2") {
      while (true) {
        console.log(
          "내정보 관리 - 1.회원 탈퇴 2.프로필 뮤직 설정 3.선호 장르 설정 4.뒤로가기"
        );
        let user = await getUserInput();
        if (user === "1") {
          console.log(`회원 탈퇴 하시겠습니까`);
        } else if (user === "2") {
          console.log(`프로필 뮤직 설정 화면입니다`);
        } else if (user === "3") {
          console.log(`선호 장르 설정 화면입니다`);
        } else if (user === "4") {
          console.log(`뒤로가기`);
          await wait(500);
          console.clear();
          break;
        } else {
          console.log("잘못된 입력입니다.");
          await wait(500);
          console.clear();
        }
      }
    } else if (menu === "3") {
      console.log(`뒤로가기`);
      await wait(500);
      console.clear();
      break;
    } else {
      console.log("잘못된 입력입니다.");
      await wait(500);
      console.clear();
    }
  }
}


const uri = process.env.DB_URL;
const client = new MongoClient(uri);
// await main(client, 4000000);

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

// const uri = process.env.DB_URL;
// const client = new MongoClient(uri);
// await main(client, 4000000);
