const { MongoClient } = require('mongodb');
const Input = require("./userInput");

const uri = process.env.DB_ATLAS_URL;


async function withdraw(client,user){
    // 계정 삭제 
    try{
        console.log('삭제할 계정의 아이디를 입력해 주세요');
        const id = await Input();

        const db = client.db('PlaylistDB');
        const collection = db.collection('user');
        

        await db.collection.deleteOne({_id: id});
        console.log(`계정이 삭제완료 되었습니다.`)
    }catch(e){
        console.log(e.message)
    }


}

// 프로필 뮤직 업데이트
async function profile(client,PlaylistDB,user){

    console.log('수정할 프로필 뮤직을 입력해 주세요');
    const music = await Input();

    db.collection.find({});

    let qry = {_id:music};
    let vals = {$set: {name : name }}


    const result = await client.db(PlaylistDB).collection(user).updateOne(qry, vals);
    console.log(result)
    console.log(`프로필 뮤직이 수정됬습니다.`);

}

// 선호 장르 업데이트
async function favorite(client,user){

}

