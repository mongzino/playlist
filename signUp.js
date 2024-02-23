import { MongoClient } from "mongodb";
import getInput from "./userInput.js";
import getUserInput from "./userInput.js";
// import prompt from "prompt";
import { password } from "./userInput.js";
import readlineSync from 'readline-sync';

// const uri = process.env.DB_URL;
// const client = new MongoClient(uri);


export default async function ckName(client){
    while(true)//닉네임
    {
        console.log("\n사용할 이름을 입력하세요")
        let mkName=await getUserInput()
        let namecheck= await client.db("PlaylistDB").collection("user").find({"name":`${mkName}`}).toArray()
        if(namecheck.length > 0 && namecheck[0].name == `${mkName}`){
            console.log("이미 존재하는 이름입니다.")
            continue
        } 
        else{
            console.log("사용 가능한 이름 입니다")
            return mkName
        }
    }
}

export async function ckId(client){
    while(true)//아이디
    {
        console.log("\n사용할 아이디를 입력하세요")
        let mkId=await getUserInput()
        let idcheck= await client.db("PlaylistDB").collection("user").find({"_id":`${mkId}`}).toArray()
        if(idcheck.length > 0 && idcheck[0]._id == `${mkId}`){
            console.log("이미 존재하는 아이디 입니다.")
            continue
        }
        else{
            console.log("사용 가능한 아이디 입니다")
            return mkId
        }
    }

}



export async function ckPassword(client){
    while(true)//비밀번호
    {
        console.log("\n사용할 비밀번호를 입력하세요")
        let mkpassword=await getUserInput()
        let passwordcheck= await client.db("PlaylistDB").collection("user").find({"password":`${mkpassword}`}).toArray()
        if(passwordcheck.length > 0 && passwordcheck[0].password == `${mkpassword}`){
            console.log("이미 존재하는 비밀번호 입니다.")
            continue
        }
        else{
            console.log("사용 가능한 비밀번호 입니다")
            return mkpassword
        }
    }

}






export async function updateGenre(client, id) {
    const genres = ['Classic', '힙합', 'R&B', '팝', '댄스', '락', '미정'];
    console.log('\n선호하는 장르는 무엇인가요?\n1.Classic 2.힙합 3.R&B 4.팝 5.댄스 6.락 7.미정');
  
    // 사용자로부터 선호하는 장르 번호를 입력받습니다.
    const answer = await getUserInput();
    const genreIndex = parseInt(answer) - 1;
  
    // 해당 번호에 맞는 장르를 찾습니다.
    const genre = genres[genreIndex];
  
    // MongoDB에 업데이트를 수행합니다.
    const database = client.db('PlaylistDB'); // 사용할 데이터베이스 이름
    const collection = database.collection('user'); // 사용할 컬렉션 이름
  
    console.log(`Before query: id = ${id}`); // 쿼리 실행 전 id 값 출력

    const query = { _id: id }; // _id 필드를 사용하여 문서를 조회
    const update = { $set: { genre } };
  
    const result = await collection.updateOne(query, update);

    console.log(`After query: id = ${id}`); // 쿼리 실행 후 id 값 출력
  
    console.log(`Matched ${result.matchedCount} documents and updated ${result.modifiedCount} documents.`);
  }
  





// createAccount.js
// createAccount.js
export async function createAccount(client, name, id, password) {
    const database = client.db('PlaylistDB'); // 사용할 데이터베이스 이름
    const collection = database.collection('user'); // 사용할 컬렉션 이름
  
    const account = { _id: id, name, password }; // _id 필드를 사용자 아이디로 설정
  
    const result = await collection.insertOne(account);
  
    console.log(`New account created with the following id: ${result.insertedId}`);
  }
  
  

  












// export async function ckpreGenre(client,name,id,password){
//     while(true)//선호 장르
//     {
//         console.log("\n선호하는 장르는 무엇인가요?")
//         console.log("1.Classic 2.힙합 3.R&B 4.팝 5.댄스 6.락 7.미정")
//         let getGenre=await getUserInput()
//         let query={ `name: ${name}`, `id: ${id}`, password: 'myPassword' }
//         switch(getGenre)
//         {
//             case "1":
//                     let result1=await client.db("PlaylistDB").collection("user").updateOne()
//                     console.log("Classic을 입력하였습니다")
//                     break
            
//             case "2":
//                     await client.db("PlaylistDB").collection("user").insertOne({"favoriteGenre":`힙합`})
//                     console.log("힙합을 입력하였습니다")
//                     break
                
//             case "3":
//                     await client.db("PlaylistDB").collection("user").insertOne({"favoriteGenre":`R&B`})
//                     console.log("R&B을 입력하였습니다")
//                     break
//             case "4":
//                     await client.db("PlaylistDB").collection("user").insertOne({"favoriteGenre":`팝`})
//                     console.log("팝을 입력하였습니다")
//                     break
//             case "5":
//                     await client.db("PlaylistDB").collection("user").insertOne({"favoriteGenre":`댄스`})
//                     console.log("댄스를 입력하였습니다")
//                     break
//             case "6":
//                     await client.db("PlaylistDB").collection("user").insertOne({"favoriteGenre":`락`})
//                     console.log("락을 입력하였습니다")
//                     break
//             case "7":
//                     await client.db("PlaylistDB").collection("user").insertOne({"favoriteGenre":`미정`})
//                     console.log("선호장르 미정입니다")
//                     break
//         }
//             return true
//     }
// }
// 패스워드 가리기
// export async function ckPassword(client){
//     while(true)
//     {
//         let mkpassword=await password()
//         let passwordcheck= await client.db("PlaylistDB").collection("user").find({"password":`${mkpassword}`}).toArray()
//         if(passwordcheck.length > 0 && passwordcheck[0].password == `${mkpassword}`){
//             console.log("\n이미 존재하는 비밀번호 입니다.")
//             continue
//         }
//         else{
//             console.log("\n사용 가능한 비밀번호 입니다")
//             return mkpassword
//         } 
//     }
    
// }




