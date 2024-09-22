import mongoose from "mongoose";

const dbConnect = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`Connected to database ${connection.connection.name}`);
  } catch (error) {
    console.log("Error connecting to database");
    throw new Error("Error connecting to database");
  }
};
export default dbConnect;
