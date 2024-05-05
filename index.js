const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const app = express();

const databasePath = path.join(__dirname, "Transactions.db");

dotenv.config({
  path: "./data/config.env",
});

app.use(cors());

let db;
const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(process.env.PORT, () =>
      console.log(`server is running on port ${process.env.PORT}`)
    );
  } catch (e) {
    console.log(`Database connect error ${e}`);
  }
};

initializeDatabaseAndServer();

app.get("/getdata", async (request, response) => {
  try {
    const dataResponse = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = await dataResponse.json();
    for (let eachValue of data) {
      const query = `
      insert into Product(
          title , price , description, category , image , sold , dateOfSale
      )values ('${eachValue.title}' , ${eachValue.price} , '${eachValue.description}' , "${eachValue.category}" , '${eachValue.image}' , ${eachValue.sold} , '${eachValue.dateOfSale}')
      `;
      await db.run(query);
    }
    response.status(200);
    response.send({ msg: "data is inserted successfuly" });
  } catch (e) {
    response.status(400);
    response.send({ error: `something went to wrong please try agian` });
  }
});

app.get("/getTableTransactions", async (req, rep) => {
  try {
    const { search, month, pageno, limit } = req.query;
    const skip = (pageno - 1) * limit;
    const query = `select * from Product where (title Like '%${search}%' or description Like '%${search}%' or price Like '%${search}%') and strftime("%m" , dateOfSale) LIKE '${month}' limit ${limit} offset ${skip}`;
    const response = await db.all(query);
    rep.status(200);
    rep.send(response);
  } catch (e) {
    rep.status(400);
    rep.send({ error: `something went to wrong please try agian` });
    console.log(e);
  }
});

app.get("/getStatistics", async (req, rep) => {
  try {
    const { month } = req.query;
    const queryOfSum = `select cast(sum(price) as int) as sumOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and sold = 1`;
    const queryOfCountOfSold = `select count(*) as numSoldOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and sold = 1`;
    const queryOfCountOfNoneSold = `select count(*) as numUnsoldOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and sold = 0`;
    const responseOfSum = await db.get(queryOfSum);
    const responseOfCountOfSold = await db.get(queryOfCountOfSold);
    const responseOfCountOfNoneSold = await db.get(queryOfCountOfNoneSold);
    rep.status(200);
    rep.send({
      sumOfReslut: responseOfSum.sumOf,
      numberSoldOfReslut: responseOfCountOfSold.numSoldOf,
      numberUnsoldOfReslut: responseOfCountOfNoneSold.numUnsoldOf,
    });
  } catch (e) {
    rep.status(400);
    rep.send({ error: `something went to wrong please try agian` });
  }
});

app.get("/barChart", async (req, rep) => {
  try {
    const { month } = req.query;
    const query1 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 0 and 100`;
    const query2 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 101 and 200`;
    const query3 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 201 and 300`;
    const query4 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 301 and 400`;
    const query5 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 401 and 500`;
    const query6 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 501 and 600`;
    const query7 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 601 and 700`;
    const query8 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 701 and 800`;
    const query9 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price between 801 and 900`;
    const query10 = `select count(*) as countOf from Product where strftime("%m" , dateOfSale) LIKE '${month}' and price >= 901`;

    const respons1 = await db.get(query1);
    const respons2 = await db.get(query2);
    const respons3 = await db.get(query3);
    const respons4 = await db.get(query4);
    const respons5 = await db.get(query5);
    const respons6 = await db.get(query6);
    const respons7 = await db.get(query7);
    const respons8 = await db.get(query8);
    const respons9 = await db.get(query9);
    const respons10 = await db.get(query10);
    rep.status(200);
    rep.send([
      { name: "0-100", countOf: respons1["countOf"] },
      {
        name: "101-200",
        countOf: respons2["countOf"],
      },
      {
        name: "201-300",
        countOf: respons3["countOf"],
      },
      {
        name: "301-400",
        countOf: respons4["countOf"],
      },
      {
        name: "401-500",
        countOf: respons5["countOf"],
      },
      {
        name: "501-600",
        countOf: respons6["countOf"],
      },
      {
        name: "601-700",
        countOf: respons7["countOf"],
      },
      {
        name: "701-800",
        countOf: respons8["countOf"],
      },
      {
        name: "801-900",
        countOf: respons9["countOf"],
      },
      {
        name: "901-above",
        countOf: respons10["countOf"],
      },
    ]);
  } catch (e) {
    rep.status(400);
    rep.send({ error: `something went to wrong please try agian` });
    console.log(e);
  }
});

app.get("/pieChart", async (req, rep) => {
  try {
    const { month } = req.query;
    const query = `select category , count(*) as ItemsCount from Product where strftime("%m" , dateOfSale) LIKE '${month}' group by category`;
    const response = await db.all(query);
    rep.status(200);
    rep.send(response);
  } catch (e) {
    rep.status(400);
    rep.send({ error: `something went to wrong please try agian` });
  }
});

app.get("/", (req, res) => {
  res.send({ msg: "hello" });
});
