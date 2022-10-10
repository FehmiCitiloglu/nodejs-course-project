const { Pool, Client } = require("pg");


const credentials = {
    user: "postgres",
    host: "localhost",
    database: "node-complete",
    password: "postgrespw",
    port: 55000,
};

const pool = new Pool(credentials);

// async function poolDemo() {
//     const now = await pool.query("SELECT NOW()");
//     await pool.end();
//     return now;
// }

module.exports = pool

// async function clientDemo() {
//     const client = new Client(credentials);
//     await client.connect();
//     const now = await client.query("SELECT NOW()");
//     await client.end();

//     return now;
// }


// (async () => {
//     const poolResult = await poolDemo();
//     console.log("Time with pool: " + poolResult.rows[0]["now"]);

//     const clientResult = await clientDemo();
//     console.log("Time with client: " + clientResult.rows[0]["now"]);
// })();
