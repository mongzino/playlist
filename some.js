import { MongoClient } from "mongodb";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);
const dbName = "PlaylistDB";

// music 컬렉션에서 모든 문서를 가져옵니다.
const documents = await client
  .db(dbName)
  .collection("music")
  .find({ singer_id: 1060000 })
  .toArray();

// 각 music 문서에 대해 처리합니다.
for (const document of documents) {
  if (document) {
    const num = Math.floor(Math.random() * 1000000) + 500000;
    await client
      .db(dbName)
      .collection("music")
      .updateOne(
        { _id: document._id },
        {
          $set: {
            views: num,
          },
        }
      );
    console.log("done");
  }
}
process.exit();
