const mongoose = require("mongoose");

// connect to db
mongoose
    .connect(process.env.DATABASE, {})
    .then(() => console.log(`Connected to the database ${mongoose.connection.host}`))
    .catch((err) => console.log(`DB Connection Error : ${err}`));
