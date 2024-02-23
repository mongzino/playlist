import { MongoClient } from "mongodb";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);
const dbName = "PlaylistDB";

// music 컬렉션에서 모든 문서를 가져옵니다.
const albumDocuments = await client
  .db(dbName)
  .collection("album")
  .find()
  .toArray();

// 각 music 문서에 대해 처리합니다.
for (const albumDocument of albumDocuments) {
  // music 문서의 album_id 값을 가져옵니다.
  const singerId = albumDocument.singer_id;

  // album 컬렉션에서 해당 album_id에 해당하는 문서를 찾습니다.
  const singerDocument = await client
    .db(dbName)
    .collection("singer")
    .findOne({ _id: singerId });

  // album 문서가 존재한다면 해당 필드를 music 문서에 추가합니다.
  if (albumDocument && singerDocument) {
    console.log("let's go");
    // music 문서를 업데이트합니다.

    await client
      .db(dbName)
      .collection("album")
      .updateOne(
        { _id: albumDocument._id },
        {
          $set: {
            singer: singerDocument.singer,
          },
        }
      );
    console.log("done");
  }
}
process.exit();
