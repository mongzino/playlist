import { MongoClient } from "mongodb";
import getInput from "./userInput.js";

// Auto Increment
async function getNextSequence(user_id) {
  var ret = await client
  .db("PlaylistDB")
  .collection("counters")
  .findOneAndUpdate(
    { _id: user_id },
    { $inc: { seq: 1 } },
    { returnDocument: 'after' }
  );
  return ret.seq;
}

export async function create(client, user_id) {
  // console.clear();
  console.log("♬ 생성할 플레이리스트의 제목을 입력해주세요");
  let title = await getInput();

  console.log("♬ 생성할 플레이리스트의 설명을 입력해주세요");
  let description = await getInput();
  
  try {
    await client
      .db("PlaylistDB")
      .collection("playlist")
      .insertOne({
        // 아이디 자동 부여하는 방법 추가
        _id: await getNextSequence(user_id),
        music_id: [],
        owner: user_id,
        title: title,
        description: description,
        views: 0,
      });
    console.log("♬ 플레이리스트가 생성되었습니다!");
  } finally {
    await getInput();
  }
}

export async function find(client, playlist) {
  console.log("♬ 조회하고 싶은 플레이리스트 번호를 선택해주세요");
  const sel = await getInput();

  try {
    console.clear();
    // 플레이리스트 정보 출력
    console.log(":: TITLE:", playlist[sel].title);
    console.log(":: DESCRIPTION:", playlist[sel].description);
    console.log(":: VIEWS:", playlist[sel].views);
    // 수록곡 출력
    let musicList = [...playlist[sel].music_id]; // 배열 복사
    for (let i = 0; i < musicList.length; i++) {
      let musicInfo = await client
        .db("PlaylistDB")
        .collection("music")
        .findOne({ _id: musicList[i] });
      musicList[i] = musicInfo;
    }
    console.table(musicList, ["title", "length", "composer", "lyricist"]);
  } catch {
    console.log("잘못된 입력입니다.");
  } finally {
    console.log(":: 조회를 끝내시려면 Enter를 입력해주세요");
    await getInput();
  }
}

export async function modify(client, playlist) {
  console.log(
    "%c♬ %c수정하고 싶은 플레이리스트 번호를 선택해주세요",
    "color: green",
    "color: white"
  );
  const sel = parseInt(await getInput());
  console.clear();
  console.log(
    "%c♬ %c1: 수록곡 편집 %c2: 제목&설명 변경",
    "color: green",
    "color: yello",
    "color: blue"
  );
  const val = parseInt(await getInput());
  if (val === 1) {
    // 수록곡 출력
    let musicList = [...playlist[sel].music_id]; // 배열 복사
    for (let i = 0; i < musicList.length; i++) {
      let musicInfo = await client
        .db("PlaylistDB")
        .collection("music")
        .findOne({ _id: musicList[i] });
      musicList[i] = musicInfo;
    }
    console.table(musicList, ["title", "length", "composer", "lyricist"]);

    // 수록곡 편집
    console.log("♬ 삭제하고 싶은 수록곡의 번호를 입력해주세요");
    const music_sel = await getInput();
    await client
      .db("PlaylistDB")
      .collection("playlist")
      .updateOne(
        { _id: playlist[sel]._id },
        { $pull: { music_id: playlist[sel].music_id[music_sel] } } // $pull : 조건을 만족하는 요소 제거
      );
  } else if (val === 2) {
    // 설정 변경
    console.log("♬ 새로운 플레이리스트 제목을 입력해주세요");
    const title = await getInput();
    console.log("♬ 새로운 플레이리스트 설명을 입력해주세요");
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
      console.log("잘못된 입력입니다.");
      await getInput();
    }
  } else {
    console.log("잘못된 입력입니다.");
  }
}

export async function remove(client, playlist) {
  try {
    console.log("♬ 삭제하고 싶은 플레이리스트 번호를 선택해주세요");
    const sel = await getInput();
    const result = await client
      .db("PlaylistDB")
      .collection("playlist")
      .deleteOne({ _id: playlist[sel]._id });
    console.log("플레이리스트가 삭제되었습니다.");
  } catch {
    console.log("잘못된 입력입니다.");
    await getInput();
  }
}

// 파일 내 테스트용 main 함수
async function main(client, user_id) {
  let menu = 0;
  // const db = "PlaylistDB";
  // const col = "playlist";
  // 사용자 정보 불러오기
  const userInfo = await client
    .db("PlaylistDB")
    .collection("user")
    .findOne({ _id: user_id });
  // console.table(userInfo);
  while (menu !== 5) {
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
    console.table(playlist/*, ["owner", "title", "description", "views"]*/);

    // 메뉴
    console.log(
      "1: 새로운 플레이리스트 만들기 2: 플레이리스트 조회하기 3: 플레이리스트 수정하기 4: 플레이리스트 삭제하기 5: 뒤로가기"
    );
    menu = parseInt(await getInput());
    if (menu === 1) {
      // console.log("새로운 플레이리스트 만들기");
      // 플레이리스트 생성 함수
      await create(client, user_id);
    } else if (menu === 2) {
      // console.log("플레이리스트 조회하기");
      // 선택한 플레이리스트의 수록곡 조회 함수
      await find(client, playlist);
    } else if (menu === 3) {
      // console.log("플레이리스트 수정하기");
      // 선택한 플레이리스트 수정 함수
      await modify(client, playlist);
    } else if (menu === 4) {
      // console.log("플레이리스트 삭제하기");
      // 내 플레이리스트 목록 보여주는 함수
      await remove(client, playlist);
    } else if (menu === 5) {
      console.log("%c뒤로가기", "color: yellow; font-style: italic;");
      process.exit();
      // return
    } else {
      console.log("잘못된 입력입니다. 메뉴를 다시 선택해주세요.");
    }
  }
}

const uri = process.env.DB_URL;
const client = new MongoClient(uri);
client.connect();
console.log("Connected successfully to server");
main(client, 4000000);