import mongoose from "mongoose";

export async function DbConnection(uri) {
  try {
    const mongoConnection = await mongoose.connect(uri);
    if (mongoConnection) {
      console.log("Succesfully connected with MongoDb ");
      return true;
    }
  } catch (error) {
    console.log("Error with MongoDb connection", error.message);
  }
}
