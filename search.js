import getInput from "./userInput.js";
import { MongoClient } from "mongodb";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);
const dbName = "PlaylistDB";
const collections = ["none", "music", "album", "singer", "playlist"];
let userId;

async function Main(ID) {
  userId = ID;
  while (true) {
    console.log(
      "1. 음악 2. 앨범 3. 가수 4. 플레이리스트 5. 통합검색 6.뒤로가기"
    );
    let tableCommand = await getInput();
    if (
      tableCommand == "1" ||
      tableCommand == "2" ||
      tableCommand == "3" ||
      tableCommand == "4"
    ) {
      await searchCondition(tableCommand);
    } else if (tableCommand == "5") {
      await searchAll();
    } else if (tableCommand == "6") {
      process.exit();
    } else console.log("올바른 값을 입력해주십시오.");
  }
}

async function searchCondition(table) {
  while (true) {
    console.log("1. 인기순 2. 가나다순 3. 추천곡 4. 검색 5. 뒤로가기");
    let sortingCommand = await getInput();

    if (sortingCommand == 1 || sortingCommand == 2 || sortingCommand == 3) {
      await searchList(table, sortingCommand);
    } else if (sortingCommand == 4) {
      await getSearch(table);
    } else if (sortingCommand == 5) break;
    else console.log("올바른 값을 입력해주십시오.");
  }
}

async function searchAll() {
  while (true) {
    console.log("검색어를 입력해주십시오");
    let searchCommand = await getInput();
    searchList(5, searchCommand);
  }
}

async function getSearch(table) {
  console.log("검색어를 입력해주십시오");
  let searchCommand = await getInput();
  await searchList(table, searchCommand);
}

async function searchList(table, command) {
  let start = 0;
  let res;
  let key = 1;
  let result;
  let max;
  let projectQuery = { title: 1 };
  let sortingQuery = {};
  let findQuery = {};

  if (command == "1" || command == "2") {
    // 조건에 따른 정렬
    max = await client
      .db(dbName)
      .collection(collections[table])
      .countDocuments();

    if (command == "1") sortingQuery = { views: -1 };
    else sortingQuery = { title: 1 };

    if (table == "3") projectQuery = { singer: 1 };
  } else {
    // 조건에 따른 검색
    if (table == "3") {
      max = await client
        .db(dbName)
        .collection(table)
        .countDocuments({ singer: { $regex: command, $options: "i" } });
      findQuery = { singer: { $regex: command, $options: "i" } };
      projectQuery = { singer: 1 };
    } else {
      max = await client
        .db(dbName)
        .collection(table)
        .countDocuments({ title: { $regex: command, $options: "i" } });
      findQuery = { title: { $regex: command, $options: "i" } };
    }
  }
  result = await client
    .db(dbName)
    .collection(collections[table])
    .find(findQuery)
    .project(projectQuery)
    .sort(sortingQuery)
    .toArray();

  while (key) {
    res = result.slice(start, start + 10);
    console.table(res);
    while (true) {
      console.log(`${res.length}.더 보기 ${res.length + 1}.뒤로가기`);
      let searchCommand = await getInput();
      if (searchCommand % 1 == 0 && searchCommand < res.length) {
        if (table == 1) {
          await searchResult(res[searchCommand]);
          key = 0;
          break;
        } else {
          await searchResultElse(table, res[searchCommand]);
          key = 0;
          break;
        }
      }
      if (searchCommand == res.length) {
        start += 10;
        break;
      } else if (searchCommand == res.length + 1) {
        key = 0;
        break;
      }
    }
    if (start + 10 >= max) break;
  }
}

async function searchResult(music) {
  const musicId = music._id;
  console.log(musicId);
  const result = await client
    .db(dbName)
    .collection("music")
    .find({ _id: musicId })
    .toArray();
  console.table(result);
  while (true) {
    console.log("1.플레이리스트에 추가하기 2.뒤로가기");
    const searchResultCommand = await getInput();
    if (searchResultCommand == 1) {
      await addMusicToPlayList(music);
      break;
    } else if (searchResultCommand == 2) break;
    else console.log("올바른 값을 입력해주세요");
  }
}

async function searchResultElse(table, value) {
  let findQuery = {};
  if (table == 2) {
    findQuery = { album_id: value._id };
  } else if (table == 3) {
    findQuery = { singer_id: value._id };
    let singerAlbums = await client
      .db(dbName)
      .collection("album")
      .find(findQuery)
      .toArray();
    findQuery = { album_id: singerAlbums[0]._id };
  } else if (table == 4) {
    findQuery = { playlist_id: value._id };
  }
  const result = await client
    .db(dbName)
    .collection("music")
    .find(findQuery)
    .toArray();
  console.table(result);
  while (true) {
    console.log(`${result.length}. 뒤로가기`);
    const command = await getInput();
    if (command < result.length && command % 1 == 0) {
      await searchResult(result[command]);
    } else if (command == result.length) break;
    else console.log("올바른 값을 입력해주세요");
  }
}

async function addMusicToPlayList(music) {
  const playList = await client
    .db(dbName)
    .collection("playlist")
    .find({ owner: userId })
    .project({ title: 1 })
    .toArray();
  console.table(playList);
  console.log("추가할 플레이리스트를 선택하세요");
  console.log(`${playList.length}. 취소하기`);
  const command = await getInput();
  if (command % 1 == 0 && command < playList.length) {
    await client
      .db(dbName)
      .collection("playlist")
      .updateOne(
        { _id: playList[command]._id },
        { $addToSet: { music_id: music._id } }
      );
    await client
      .db(dbName)
      .collection("music")
      .updateOne(
        { _id: music._id },
        { $addToSet: { playlist_id: playList[command]._id } }
      );
    console.log(
      ` ${music.title}가 ${playList[command].title} 플레이리스트에 추가 되었습니다.`
    );
  }
}

Main(4000000);
