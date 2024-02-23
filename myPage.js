import { MongoClient } from "mongodb";
import getUserInput from "./userInput.js";
import { create, find, modify, remove } from "./myPlaylist.js";
import chalk from "chalk";

import { withdraw, profileMusic, favoriteGenre } from "./myInfo.js"; 
// info 페이지 추가
async function main(){
    const uri = process.env.DB_URL;
    const client = new MongoClient(uri);

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
          await wait(500);
          console.clear();
          break;
        } else {
          console.log(chalk.cyan("잘못된 입력입니다."));
          await wait(500);
          console.clear();
        }
      }
    } else if (menu === "3") {
      await wait(500);
      console.clear();
      break;
    } else {
      console.log(chalk.cyan("잘못된 입력입니다."));
      await wait(500);
      console.clear();
    }
  }
}

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

// const uri = process.env.DB_URL;
// const client = new MongoClient(uri);
// await main(client, 4000000);
