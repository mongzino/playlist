import { MongoClient } from "mongodb";
import getUserInput from "./userInput.js";
import chalk from "chalk";
import ckName, { ckPassword, updateGenre, createAccount } from "./signUp.js";
import { login } from "./login.js";
import mypage from "./myPage.js";
import search from "./search.js";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);

async function main() {
  let id = 0;
  try {
    while (true) {
      console.log(
        chalk.cyan(`
██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗
██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝
╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
      `)
      );
      console.log(chalk.bgCyan("치타 뮤직에 오신 것을 환영합니다"));
      console.log(
        chalk.white("1.회원 가입 2.로그인"),
        chalk.cyan("3.프로그램 종료")
      );
      let mainInput = await getUserInput();

      if (mainInput == 1) {
        let name = await ckName(client);
        // let id = await ckId(client);
        let password = await ckPassword(client);
        if (name && password) {
          console.log(
            chalk.bgCyan(`\n계정생성 되었습니다 환영합니다 ${name}님`)
          );
          await createAccount(client, name, password);
          await updateGenre(client, name, password);
        }
      } else if (mainInput == 2) {
        // console.log("로그인");
        // 로그인 id 정보 리턴 받도록
        id = await login(client);
        while (id) {
          console.log(
            chalk.white("1.검색하기 2.마이페이지"),
            chalk.cyan("3.로그아웃")
          );
          let Umenu = await getUserInput();
          if (Umenu == 1) {
            await search(id, client);
          } else if (Umenu == 2) {
            await mypage(client, id);
          } else if (Umenu == 3) {
            break;
          } else {
            console.log(chalk.cyan("해당하는 번호가 아닙니다."));
          }
        }
      } else if (mainInput == 3) {
        console.log(chalk.cyan("프로그램을 종료합니다."));
        process.exit();
      } else {
        console.log(chalk.cyan("해당하는 번호가 아닙니다."));
      }

      console.log(
        chalk.bgWhiteBright("\n메인 메뉴로 넘어가려면 엔터를 입력하세요")
      );
      await getUserInput();
      console.clear();
    }
  } catch (e) {
    console.error;
  } finally {
    await client.close();
  }
}

main();
