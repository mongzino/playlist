import getInput from "./userInput.js";

const dbName = "PlaylistDB";
const collections = ["none", "music", "album", "singer", "playlist"];
let userId;
let client;

export default async function main(ID, cli) {
  userId = ID;
  client = cli;
  while (true) {
    console.log(
      "1. 음악 2. 앨범 3. 가수 4. 플레이리스트 5. 통합검색 (아직) 6.뒤로가기"
    );
    let tableCommand = await getInput();
    if (
      tableCommand == 1 ||
      tableCommand == 2 ||
      tableCommand == 3 ||
      tableCommand == 4
    ) {
      await searchCondition(tableCommand);
    } else if (tableCommand == 5) {
      await searchAll();
    } else if (tableCommand == 6) {
      console.clear();
      break;
    } else console.log("올바른 값을 입력해주십시오.");
  }
}

async function searchCondition(table) {
  while (true) {
    console.log("1. 인기순 2. 가나다순 3. 추천 4. 검색 5. 뒤로가기");
    let command = await getInput();

    if (command == 1 || command == 2 || command == 3) {
      await searchList(table, command);
    } else if (command == 4) {
      await getSearch(table);
    } else if (command == 5) {
      console.clear();
      break;
    } else console.log("올바른 값을 입력해주십시오.");
  }
}

async function searchAll() {
  //이건 나중에
  console.log("검색어를 입력해주십시오");
  let command = await getInput();

  let musicMax = await client
    .db(dbName)
    .collection("music")
    .countDocuments({ title: { $regex: command, $options: "i" } });
  let albumMax = await client
    .db(dbName)
    .collection("album")
    .countDocuments({ title: { $regex: command, $options: "i" } });
  let singerMax = await client
    .db(dbName)
    .collection("singer")
    .countDocuments({ singer: { $regex: command, $options: "i" } });

  result = await client
    .db(dbName)
    .collection("music")
    .find({ singer: { $regex: command, $options: "i" } })
    .project({})
    .sort()
    .toArray();
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
  let sortingQuery = { title: 1 };
  let findQuery = {};

  if (command == 1 || command == 2) {
    // 조건에 따른 정렬
    max = await client // document 개수
      .db(dbName)
      .collection(collections[table])
      .countDocuments();
    if (command == 1) sortingQuery = { views: -1 }; // 인기순
  } else if (command == 3) {
    const user = await client
      .db(dbName)
      .collection("user")
      .find({ _id: userId })
      .toArray();
    const userGenre = user[0].genre;
    max = await client
      .db(dbName)
      .collection(collections[table])
      .countDocuments({ genre: userGenre });
    findQuery = { genre: userGenre };
  } else {
    // 조건에 따른 검색
    if (table == 3) {
      max = await client
        .db(dbName)
        .collection(table)
        .countDocuments({ singer: { $regex: command, $options: "i" } });
      findQuery = { singer: { $regex: command, $options: "i" } };
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
    .sort(sortingQuery)
    .toArray();
  if (command == 3) {
    let random = [];
    let num = 0;
    for (let i = 0; i < max; i++) {
      random[i] = { index: num, value: Math.random() };
      num++;
    }
    random.sort((a, b) => a.value - b.value);
    for (let i = 0; i < max; i++) {
      random[i] = result[random[i].index];
    }
    result = random;
  }

  while (key) {
    res = result.slice(start, start + 10);
    if (table == 1 || table == 2) {
      console.table(
        res.map((item) => ({ 제목: item.title, 가수: item.singer }))
      );
    } else if (table == 3)
      console.table(res.map((item) => ({ 이름: item.singer })));
    else console.table(res.map((item) => ({ 이름: item.title })));
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
    if (start + 10 >= max) {
      console.clear();
      break;
    }
  }
}

async function searchResult(music) {
  const musicId = music._id;
  const result = await client
    .db(dbName)
    .collection("music")
    .find({ _id: musicId })
    .toArray();
  await client
    .db(dbName)
    .collection("music")
    .updateOne({ _id: musicId }, { $inc: { views: 1 } });
  console.table(
    result.map((item) => ({
      제목: item.title,
      가수: item.singer,
      앨범: item.albumTitle,
      장르: item.genre,
      발매일: item.release,
      시간: `${item.length[0]}분 ${item.length[1]}초`,
      조회수: `${item.views}회`,
    }))
  );

  while (true) {
    console.log("1.플레이리스트에 추가하기 2.뒤로가기");
    const searchResultCommand = await getInput();
    if (searchResultCommand == 1) {
      await addMusicToPlayList(1, music);
      console.clear();
      break;
    } else if (searchResultCommand == 2) {
      console.clear();
      break;
    } else console.log("올바른 값을 입력해주세요");
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
  await client
    .db(dbName)
    .collection(collections[table])
    .updateOne({ _id: value._id }, { $inc: { views: 1 } });

  value = await client
    .db(dbName)
    .collection(collections[table])
    .find({ _id: value._id })
    .toArray();
  if (table == 2) {
    console.table(
      value.map((item) => ({
        앨범명: item.title,
        가수: item.singer,
        발매일: item.release,
        장르: item.genre,
        시간: `${item.length[0]}분 ${item.length[1]}초`,
        재생수: `${item.views}회`,
      }))
    );
  } else if (table == 3) {
    console.table(
      value.map((item) => ({
        가수: item.singer,
        데뷔일: item.debut,
        장르: item.genre,
        조회수: `${item.views}회`,
      }))
    );
  } else if (table == 4) {
    console.table(
      value.map((item) => ({
        플레이리스트: item.title,
        제작자: item.owner,
        소개: item.description,
        재생수: `${item.views}회`,
      }))
    );
  }
  console.table(
    result.map((item) => ({
      제목: item.title,
      시간: `${item.length[0]}분 ${item.length[1]}초`,
      재생수: `${item.views}회`,
    }))
  );
  while (true) {
    console.log(
      `${result.length}. ${collections[table]} 전체 플레이리스트에 추가하기 ${
        result.length + 1
      }. 뒤로가기`
    );
    const command = await getInput();
    if (command < result.length && command % 1 == 0) {
      await searchResult(result[command]);
    } else if (command == result.length) {
      await addMusicToPlayList(table, result);
      console.clear();
      break;
    } else if (command == result.length + 1) {
      console.clear();
      break;
    } else console.log("올바른 값을 입력해주세요");
  }
}

async function addMusicToPlayList(table, target) {
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
    if (table == 1) {
      await client
        .db(dbName)
        .collection("playlist")
        .updateOne(
          { _id: playList[command]._id },
          { $addToSet: { music_id: target._id } }
        );
      await client
        .db(dbName)
        .collection("music")
        .updateOne(
          { _id: target._id },
          { $addToSet: { playlist_id: playList[command]._id } }
        );
      console.log(
        ` ${target.title}가 ${playList[command].title} 플레이리스트에 추가 되었습니다.`
      );
    } else {
      await target.forEach((tag) => {
        client
          .db(dbName)
          .collection("playlist")
          .updateOne(
            { _id: playList[command]._id },
            { $addToSet: { music_id: tag._id } }
          );
        client
          .db(dbName)
          .collection("music")
          .updateOne(
            { _id: tag._id },
            { $addToSet: { playlist_id: playList[command]._id } }
          );
      });
      console.log(
        ` ${collections[table]}가 ${playList[command].title} 플레이리스트에 추가 되었습니다.`
      );
    }
  }
}
