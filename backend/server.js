// \backend\server.js
require('dotenv').config();

const app=require('./src/app');

// const host="localhost";
const PORT=process.env.PORT;

app.listen(PORT,(err)=> {
    if (err) {
        console.error(`? Failed to start server on port ${port}:`, err);
        process.exit(1);
    }
    console.log(`App listening to port ${PORT}`);

});