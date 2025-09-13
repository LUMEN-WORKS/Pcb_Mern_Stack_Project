const mongoose = require("mongoose");

const dburl = "mongodb+srv://lumenworks:12345L@clusterfirst.uqsjoka.mongodb.net/?retryWrites=true&w=majority&appName=ClusterFirst";

mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connection = async () => {
  try {
    await mongoose.connect(dburl);
    console.log("MongoDB Connected~");
  } catch (e) {
    console.error(e.message);
    process.exit();
  }
};
module.exports = connection;