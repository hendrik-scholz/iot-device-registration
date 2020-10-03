// https://stackoverflow.com/questions/13607732/in-memory-mongodb-for-test
// https://www.npmjs.com/package/mongodb-memory-server
import { MongoMemoryServer } from "mongodb-memory-server";
import { DeviceModel } from "../../src/db/deviceSchema";
import mongoose, { Mongoose } from "mongoose";

let mongod: MongoMemoryServer;
let connectionString: string;

function startInMemoryMongoDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    mongod = new MongoMemoryServer();
    mongod
      .getUri()
      .then((uri: string) => {
        connectionString = uri;
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

function stopInMemoryMongoDB(): Promise<boolean> {
  return mongod.stop();
}

function getConnectionStringForInMemoryMongoDB(): string {
  return connectionString;
}

function getConnectionStringForLocalMongoDB(): string {
  return "mongodb://127.0.0.1:27017/test";
}

// function connectToMongoDb(connString: string): Promise<Mongoose> {
function connectToMongoDb(connString: string) {
  mongoose.connect(connString, { useNewUrlParser: true });
}

function disconnectFromTestMongoDb(): Promise<void> {
  return mongoose.connection.close();
}

function insertDocument(document: any): Promise<mongoose.Document> {
  document._id = new mongoose.Types.ObjectId();
  const deviceModel = new DeviceModel(document);
  return deviceModel.save(document);
}

function removeAllDocuments() {
  DeviceModel.deleteMany({}, (error: any) => {
    if (error) {
      console.log(`error removing all documents: ${error}.`);
    }
  });
}

export {
  startInMemoryMongoDB,
  stopInMemoryMongoDB,
  connectToMongoDb,
  disconnectFromTestMongoDb,
  getConnectionStringForInMemoryMongoDB,
  getConnectionStringForLocalMongoDB,
  insertDocument,
  removeAllDocuments,
};
