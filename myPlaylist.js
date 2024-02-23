import { MongoClient } from "mongodb";
import getInput from "./userInput.js";
import chalk from "chalk";

// Auto Increment
async function getNextSequence(client, user_id) {
  var ret = await client
    .db("PlaylistDB")
    .collection("counters")
    .findOneAndUpdate(
      { _id: user_id },
      { $inc: { seq: 1 } },
      { returnDocument: "after" }
    );
  return ret.seq;
}

export async function create(client, user_id) {
  // console.clear();
  console.log(chalk.bgWhiteBright(" ▶ 생성할 플레이리스트의 제목을 입력해주세요"));
  let title = await getInput();

  console.log(chalk.bgWhiteBright(" ▶ 생성할 플레이리스트의 설명을 입력해주세요"));
  let description = await getInput();

  try {
    await client
      .db("PlaylistDB")
      .collection("playlist")
      .insertOne({
        // 아이디 자동 부여하는 방법 추가
        _id: await getNextSequence(client, user_id),
        music_id: [],
        owner: user_id,
        title: title,
        description: description,
        views: 0,
      });
    console.log(chalk.cyan("플레이리스트가 생성되었습니다!"));
  } finally {
    await getInput();
  }
}

export async function find(client, playlist) {
  console.log(chalk.bgWhiteBright(" ▶ 조회하고 싶은 플레이리스트 번호를 선택해주세요"));
  const sel = await getInput();

  try {
    console.clear();
    // 플레이리스트 정보 출력
    console.log(chalk.cyan(":: TITLE:"), chalk.yellow(playlist[sel].title));
    console.log(chalk.cyan(":: DESCRIPTION:"), chalk.yellow(playlist[sel].description));
    console.log(chalk.cyan(":: VIEWS:"), chalk.yellow(playlist[sel].views));
    // 수록곡 출력
    let musicList = await client
      .db("PlaylistDB")
      .collection("music")
      .find({ playlist_id: playlist[sel]._id })
      .toArray();
    console.table(musicList, ["title", "length", "composer", "lyricist"]);
  } finally {
    console.log(chalk.cyan(" ▶ 조회를 끝내려면 Enter를 입력해주세요"));
    await getInput();
    return;
  }
}

export async function modify(client, playlist) {
  console.log(chalk.bgWhiteBright(" ▶ 수정하고 싶은 플레이리스트 번호를 선택해주세요"));
  const sel = parseInt(await getInput());
  if (sel > playlist.length){
    console.log(chalk.cyan("잘못된 입력입니다."));
    await getInput();
    return;
  }
  console.clear();
  console.log(chalk.bgWhiteBright(" ▶ 1: 수록곡 편집 2: 제목&설명 변경"));
  const val = parseInt(await getInput());
  if (val === 1) {
    // 수록곡 출력
    try {let musicList = await client
      .db("PlaylistDB")
      .collection("music")
      .find({ playlist_id: playlist[sel]._id })
      .toArray();
    console.table(musicList, ["title", "length", "composer", "lyricist"]);}
    catch {
      console.log(chalk.cyan("잘못된 입력입니다."));
      await getInput();
      return;
    }

    // 수록곡 편집
    console.log(chalk.bgWhiteBright(" ▶ 삭제하고 싶은 수록곡의 번호를 입력해주세요"));
    const music_sel = await getInput();
    try {
      // playlist에서 music_id 삭제
      await client
        .db("PlaylistDB")
        .collection("playlist")
        .updateOne(
          { _id: playlist[sel]._id },
          { $pull: { music_id: playlist[sel].music_id[music_sel] } } // $pull : 조건을 만족하는 요소 제거
        );
      // music에서 playlist_id 삭제
      await client.db("PlaylistDB")
      .collection("music")
      .updateOne({ _id: playlist[sel].music_id[music_sel] },
        { $pull: { playlist_id: playlist[sel]._id } } // $pull : 조건을 만족하는 요소 제거
      );
        console.log(chalk.cyan("수록곡이 삭제되었습니다."));
    } catch {
      console.log(chalk.cyan("잘못된 입력입니다."));
    } finally {
      await getInput();
      return;
    }
  } else if (val === 2) {
    // 설정 변경
    console.log(chalk.bgWhiteBright(" ▶ 새로운 플레이리스트 제목을 입력해주세요"));
    const title = await getInput();
    console.log(chalk.bgWhiteBright(" ▶ 새로운 플레이리스트 설명을 입력해주세요"));
    const description = await getInput();

    try {
      await client
        .db("PlaylistDB")
        .collection("playlist")
        .updateOne(
          { _id: playlist[sel]._id },
          { $set: { title: title, description: description } }
        );
    } catch {
      console.log(chalk.cyan("잘못된 입력입니다."));
      await getInput();
    }
  } else {
    console.log(chalk.cyan("잘못된 입력입니다."));
  }
}

export async function remove(client, playlist) {
  try {
    console.log(chalk.bgWhiteBright(" ▶ 삭제하고 싶은 플레이리스트 번호를 선택해주세요"));
    const sel = await getInput();
    const result = await client
      .db("PlaylistDB")
      .collection("playlist")
      .deleteOne({ _id: playlist[sel]._id });
    console.log(chalk.cyan("플레이리스트가 삭제되었습니다."));
    await getInput();
  } catch {
    console.log(chalk.cyan("잘못된 입력입니다."));
    await getInput();
  }
}

// 파일 내 테스트용 main 함수
async function main(client, user_id) {
  let pl_menu = 0;
  // const db = "PlaylistDB";
  // const col = "playlist";
  // 사용자 정보 불러오기
  const userInfo = await client
    .db("PlaylistDB")
    .collection("user")
    .findOne({ _id: user_id });
  // console.table(userInfo);
  while (pl_menu !== 5) {
    console.clear();

    // 내 플레이리스트 목록 보여주기
    const playlist = await client
      .db("PlaylistDB")
      .collection("playlist")
      .find({ owner: user_id })
      .toArray();
    playlist.forEach((pl) => {
      pl.owner = userInfo.name;
    });
    console.table(playlist /*, ["owner", "title", "description", "views"]*/);

    // 메뉴
    console.log(
      "1: 새로운 플레이리스트 만들기 2: 플레이리스트 조회하기 3: 플레이리스트 수정하기 4: 플레이리스트 삭제하기 5: 뒤로가기"
    );
    pl_menu = parseInt(await getInput());
    if (pl_menu === 1) {
      // console.log("새로운 플레이리스트 만들기");
      // 플레이리스트 생성 함수
      await create(client, user_id);
    } else if (pl_menu === 2) {
      // console.log("플레이리스트 조회하기");
      // 선택한 플레이리스트의 수록곡 조회 함수
      await find(client, playlist);
    } else if (pl_menu === 3) {
      // console.log("플레이리스트 수정하기");
      // 선택한 플레이리스트 수정 함수
      await modify(client, playlist);
    } else if (pl_menu === 4) {
      // console.log("플레이리스트 삭제하기");
      // 내 플레이리스트 목록 보여주는 함수
      await remove(client, playlist);
    } else if (pl_menu === 5) {
      console.log("뒤로가기");
      process.exit();
      // return
    } else {
      console.log("잘못된 입력입니다. 메뉴를 다시 선택해주세요.");
    }
  }
}

// const uri = process.env.DB_URL;
// const client = new MongoClient(uri);
// client.connect();
// console.log("Connected successfully to server");
// main(client, 4000000);
