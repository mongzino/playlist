import getInput from "./userInput.js";

const dbName = "PlaylistDB";
const collections = [null, "music", "album", "singer", "playlist"];
const collectionsKor = [null, "음악", "앨범", "가수", "플레이리스트"];
let userId;
let client;

export default async function searchMain(ID, cli) {
  userId = ID;
  client = cli;
  while (true) {
    console.clear();
    console.log(
      "검색할 메뉴 1. 음악 2. 앨범 3. 가수 4. 플레이리스트 5.뒤로가기"
    ); // collection 선택
    const command = await getInput();
    if (command == 1 || command == 2 || command == 3 || command == 4) {
      await searchMenu(command);
    } else if (command == 5) {
      console.clear();
      break;
    } else console.log("올바른 값을 입력해주십시오.");
    await wait(1000);
  }
}

async function searchMenu(coll) {
  while (true) {
    console.clear();
    console.log(
      `${collectionsKor[coll]}메뉴 1. 인기순 2. 이름순 3. 추천 4. 검색 5. 뒤로가기`
    );
    const command = await getInput();

    if (command == 1 || command == 2 || command == 3) {
      await loadSearchResult(coll, command);
    } else if (command == 4) {
      await getSearch(coll);
    } else if (command == 5) {
      console.clear();
      break;
    } else console.log("올바른 값을 입력해주십시오.");
    await wait(1000);
  }
}

async function getSearch(coll) {
  // 검색어 입력
  console.log("검색어를 입력해주십시오");
  let searchCommand = await getInput();
  await loadSearchResult(coll, searchCommand);
}

async function loadSearchResult(coll, command) {
  let result; //검색의 결과
  let sortingQuery = { title: 1 }; // 정렬 query문
  let findQuery = {}; // 검색 query문

  if (command == 1 || command == 2) {
    // 조건에 따른 정렬
    if (command == 1) sortingQuery = { views: -1 }; // 인기순 정렬
    result = await client
      .db(dbName)
      .collection(collections[coll])
      .find(findQuery)
      .sort(sortingQuery)
      .toArray();
  } else if (command == 3) {
    //추천을 위한 유저 선호 장르 확인
    const user = await client
      .db(dbName)
      .collection("user")
      .find({ _id: userId })
      .toArray();

    const userGenre = user[0].genre;
    findQuery = { genre: userGenre };

    const res = await client
      .db(dbName)
      .collection(collections[coll])
      .find(findQuery)
      .sort(sortingQuery)
      .toArray();
    result = await randomRecommend(res); // 배열의 순서를 랜덤하게 섞어주는 함수
  } else {
    // 검색어를 포함한 결과 검색
    if (coll == 3) findQuery = { singer: { $regex: command, $options: "i" } };
    else findQuery = { title: { $regex: command, $options: "i" } };
    result = await client
      .db(dbName)
      .collection(collections[coll])
      .find(findQuery)
      .sort(sortingQuery)
      .toArray();
  }
  console.clear();
  await displaySearchResult(coll, command, result);
}

async function randomRecommend(input) {
  // 배열의 순서를 랜덤하게 섞어주는 함수

  const max = input.length;
  let random = [];
  let num = 0;
  for (let i = 0; i < max; i++) {
    random[i] = { index: num, value: Math.random() };
    num++;
  }
  random.sort((a, b) => a.value - b.value);
  for (let i = 0; i < max; i++) {
    random[i] = input[random[i].index];
  }

  return random;
}

async function displaySearchResult(coll, command, result) {
  let start = 0;
  let end;
  let res;
  const max = result.length;
  while (true) {
    end = max > start + 10 ? start + 10 : max;
    res = result.slice(start, end); // 한번에 최대 10개의 결과만 출력
    let sentence;
    if (command == 1) sentence = `인기순위`;
    else if (command == 2) sentence = `가나다순`;
    else if (command == 3) sentence = `선호장르 추천 `;
    else sentence = `"${command}" 검색결과`;
    console.log(`${collectionsKor[coll]} - ${sentence} ${start} - ${end - 1}`);
    if (coll == 1 || coll == 2) {
      console.table(
        res.map((item) => ({ 제목: item.title, 가수: item.singer }))
      );
    } else if (coll == 3)
      console.table(res.map((item) => ({ 이름: item.singer })));
    else console.table(res.map((item) => ({ 이름: item.title })));
    while (true) {
      console.log(`${res.length}.더 보기 ${res.length + 1}.뒤로가기`);
      let command = await getInput();
      if (command % 1 == 0 && command < res.length) {
        if (coll == 1) {
          console.clear();
          await displayMusic(res[command]);
          return;
        } else {
          console.clear();
          await displayList(coll, res[command]);
          return;
        }
      }
      if (command == res.length) {
        // 다음 10개의 결과
        start += 10;
        break;
      } else if (command == res.length + 1) {
        return;
      }
    }
    if (start >= max) {
      // 더 이상 출력할 결과가 없을 때
      console.clear();
      return;
    }
  }
}

async function displayMusic(music) {
  // 노래의 정보 출력
  const musicId = music._id;
  const result = await client
    .db(dbName)
    .collection("music")
    .find({ _id: musicId })
    .toArray();
  await client
    .db(dbName)
    .collection("music")
    .updateOne({ _id: musicId }, { $inc: { views: 1 } }); // 재생수 1 증가
  console.log("곡 정보");
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
    const command = await getInput();
    if (command == 1) {
      await addMusicToPlayList(1, result);
      break;
    } else if (command == 2) {
      break;
    } else console.log("올바른 값을 입력해주세요");
  }
}

async function displayList(coll, list) {
  // 앨범, 가수, 플레이 리스트의 정보와 포함 된 곡을 출력

  let findQuery = {};
  if (coll == 2) findQuery = { album_id: list._id };
  else if (coll == 3) findQuery = { singer_id: list._id };
  else if (coll == 4) findQuery = { playlist_id: list._id };

  const result = await client
    .db(dbName)
    .collection("music")
    .find(findQuery)
    .toArray();

  await client
    .db(dbName)
    .collection(collections[coll])
    .updateOne({ _id: list._id }, { $inc: { views: 1 } }); // 조회수 1 증가
  let listName = list.title;

  list = await client
    .db(dbName)
    .collection(collections[coll])
    .find({ _id: list._id })
    .toArray();
  console.log(`${collectionsKor[coll]} 정보`);
  if (coll == 2) {
    // 앨범 정보
    console.table(
      list.map((item) => ({
        앨범명: item.title,
        가수: item.singer,
        발매일: item.release,
        장르: item.genre,
        시간: `${item.length[0]}분 ${item.length[1]}초`,
        재생수: `${item.views}회`,
      }))
    );
  } else if (coll == 3) {
    // 가수 정보
    listName = list[0].singer;
    console.table(
      list.map((item) => ({
        가수: item.singer,
        데뷔일: item.debut,
        장르: item.genre,
        조회수: `${item.views}회`,
      }))
    );
  } else if (coll == 4) {
    // 플레이리스트 정보
    const user = await client
      .db(dbName)
      .collection("user")
      .find({ _id: list[0].owner })
      .toArray();

    console.table(
      list.map((item) => ({
        플레이리스트: item.title,
        제작자: user[0].name,
        소개: item.description,
        재생수: `${item.views}회`,
      }))
    );
  }
  console.table(
    // 포함된 곡 정보
    result.map((item) => ({
      제목: item.title,
      가수: item.singer,
      시간: `${item.length[0]}분 ${item.length[1]}초`,
      재생수: `${item.views}회`,
    }))
  );
  while (true) {
    console.log(
      `${result.length}. ${collections[coll]} 전체 플레이리스트에 추가하기 ${
        result.length + 1
      }. 뒤로가기`
    );
    const command = await getInput();
    if (command < result.length && command % 1 == 0) {
      await displayMusic(result[command]._id);
      break;
    } else if (command == result.length) {
      await addMusicToPlayList(coll, result, listName);
      console.clear();
      break;
    } else if (command == result.length + 1) {
      console.clear();
      break;
    } else console.log("올바른 값을 입력해주세요");
  }
}

async function addMusicToPlayList(coll, target, listName) {
  console.clear();
  console.log("내 플레이리스트 목록");
  const playList = await client
    .db(dbName)
    .collection("playlist")
    .find({ owner: userId })
    .toArray();
  console.table(
    // user가 생성한 전체 플레이리스트 목록 출력
    playList.map((item) => ({
      플레이리스트: item.title,
      설명: item.description,
    }))
  );
  console.log("추가할 플레이리스트를 선택하세요");
  console.log(`${playList.length}. 취소하기`);
  const command = await getInput();
  if (command % 1 == 0 && command < playList.length) {
    if (coll == 1) {
      await client
        .db(dbName)
        .collection("playlist")
        .updateOne(
          { _id: playList[command]._id },
          { $addToSet: { music_id: target[0]._id } } //플레이 리스트에 해당 곡 추가
        );
      await client
        .db(dbName)
        .collection("music")
        .updateOne(
          { _id: target[0]._id },
          { $addToSet: { playlist_id: playList[command]._id } } // 해당곡이 소속된 플레이리스트 목록 추가
        );
      console.log(
        ` ${target[0].title}가 ${playList[command].title} 플레이리스트에 추가 되었습니다.`
      );
    } else {
      await target.forEach((tag) => {
        // 리스트 전체를 플레이리스트에 추가
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
        `${listName} ${collectionsKor[coll]}의 곡이 ${playList[command].title} 플레이리스트에 추가 되었습니다.`
      );
    }
  }
  await wait(2000);
}

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));
