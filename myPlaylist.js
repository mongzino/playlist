import { getUserInput } from "./function/userInput.js";

async function create(connection) {

}

async function find(connection) {
  
}

async function modify(connection) {
  
}

async function remove(connection) {
  
}

async function main(connection) {
  const input = await getUserInput();
  console.log(input);
}

const uri = process.env.DB_URL;
const client = new MongoClient(uri);
client.connect();
console.log('Connected successfully to server');
main()