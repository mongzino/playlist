import { MongoClient } from "mongodb";
import getUserInput from "userInput";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);

function main() {}

main();

export default client;
