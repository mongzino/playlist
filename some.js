import { MongoClient } from "mongodb";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);
const dbName = "PlaylistDB";

// music 컬렉션에서 모든 문서를 가져옵니다.
const musicDocuments = await client
  .db(dbName)
  .collection("music")
  .find()
  .toArray();

// 각 music 문서에 대해 처리합니다.
for (const musicDocument of musicDocuments) {
  // music 문서의 album_id 값을 가져옵니다.
  const albumId = musicDocument.album_id;

  // album 컬렉션에서 해당 album_id에 해당하는 문서를 찾습니다.
  const albumDocument = await client
    .db(dbName)
    .collection("album")
    .findOne({ _id: albumId });

  // album 문서가 존재한다면 해당 필드를 music 문서에 추가합니다.
  if (albumDocument) {
    musicDocument.singer_id = albumDocument.singer_id;
    musicDocument.genre = albumDocument.genre;
    musicDocument.release = albumDocument.release;

    // music 문서를 업데이트합니다.
    await client
      .db(dbName)
      .collection("music")
      .updateOne(
        { _id: musicDocument._id },
        {
          $set: {
            singer_id: albumDocument.singer_id,
            genre: albumDocument.genre,
            release: albumDocument.release,
          },
        }
      );
  }
}
