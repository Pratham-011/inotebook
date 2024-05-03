const mongoose = require('mongoose');

// const mongoURI = "mongodb://127.0.0.1:27017/iNoteBook"
const mongoURI = "mongodb+srv://prathamds02:1234@cluster0.aa2d7p9.mongodb.net/"

const connectToMongo = async () =>{
    await mongoose.connect(mongoURI)
        console.log("Connected to Mongo Successfully");
    }
module.exports = connectToMongo;

// const mongoose = require('mongoose');

// const mongoURI = "mongodb://127.0.0.1:27017";

// const connectToMongo = async () => {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log("Connected to Mongo successfully!");
//   } catch (error) {
//     console.error(error);
//   }
// };

// module.exports = connectToMongo;
