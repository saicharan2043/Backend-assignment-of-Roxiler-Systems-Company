const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const app = express();

const connection = mysql.createConnection({
  host: "db4free.net",
  port: 3306,
  user: "shiva_kumar",
  password: "sai@1234",
  database: "user_details_db",
});

connection.connect(function (error) {
  if (error) throw error;
  console.log("database successfuly connected..");
});

dotenv.config({
  path: "./data/config.env",
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://product-transction-project.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/getdata", async (request, response) => {
  const dataResponse = await fetch(
    "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
  );
  const data = await dataResponse.json();
  console.log(data.length);
  //   for (let eachValue of data) {
  //     connection.query(
  //       `
  //     insert into Product(
  //         title , price , description, category , image , sold , dateOfSale
  //     )values ('${eachValue.title}' , ${eachValue.price} , '${eachValue.description}' , "${eachValue.category}" , '${eachValue.image}' , ${eachValue.sold} , '${eachValue.dateOfSale}')
  //     `,
  //       (error, reslut) => {
  //         if (error) throw error;
  //         console.log(reslut);
  //       }
  //     );
  //   }
  response.send("data sended");
});

app.get("/getTableTransactions", (request, response) => {
  const { search, month, pageno, limit } = request.query;
  const skip = (pageno - 1) * limit;
  const checkSearchValue = search === "0" ? "%%" : `%${search}%`;
  connection.query(
    `
    select * from Product where (title Like '${checkSearchValue}' or description Like '${checkSearchValue}' or price Like '${checkSearchValue}') and MONTH(dateOfSale) LIKE ${month} limit ${limit} offset ${skip}
  `,
    (error, reslut) => {
      if (error) throw error;
      response.send(reslut);
    }
  );
});

app.get("/getStatistics", (request, response) => {
  const { month } = request.query;
  const query1 = `select sum(price) as sumOf from Product where MONTH(dateOfSale) LIKE ${month} and sold = 1`;
  const query2 = `select count(*) as numSoldOf from Product where MONTH(dateOfSale) LIKE ${month} and sold = 1`;
  const query3 = `select count(*) as numUnsoldOf from Product where MONTH(dateOfSale) LIKE ${month} and sold = 0`;
  // request one
  connection.query(query1, (error1, sumOfReslut) => {
    if (error1) throw error1;
    // request two
    connection.query(query2, (error2, numberSoldOfReslut) => {
      if (error2) throw error2;
      // request three
      connection.query(query3, (error3, numberUnsoldOfReslut) => {
        if (error3) throw error3;
        // send response to the client
        response.send({
          sumOfReslut: sumOfReslut[0].sumOf,
          numberSoldOfReslut: numberSoldOfReslut[0].numSoldOf,
          numberUnsoldOfReslut: numberUnsoldOfReslut[0].numUnsoldOf,
        });
      });
    });
  });
});

app.get("/barChart", (request, response) => {
  const { month } = request.query;
  const query1 = `select count(*) as 0To100 from Product where MONTH(dateOfSale) LIKE ${month} and price between 0 and 100`;
  const query2 = `select count(*) as 101To200 from Product where MONTH(dateOfSale) LIKE ${month} and price between 101 and 200`;
  const query3 = `select count(*) as 201To300 from Product where MONTH(dateOfSale) LIKE ${month} and price between 201 and 300`;
  const query4 = `select count(*) as 301To400 from Product where MONTH(dateOfSale) LIKE ${month} and price between 301 and 400`;
  const query5 = `select count(*) as 401To500 from Product where MONTH(dateOfSale) LIKE ${month} and price between 401 and 500`;
  const query6 = `select count(*) as 501To600 from Product where MONTH(dateOfSale) LIKE ${month} and price between 501 and 600`;
  const query7 = `select count(*) as 601To700 from Product where MONTH(dateOfSale) LIKE ${month} and price between 601 and 700`;
  const query8 = `select count(*) as 701To800 from Product where MONTH(dateOfSale) LIKE ${month} and price between 701 and 800`;
  const query9 = `select count(*) as 801To900 from Product where MONTH(dateOfSale) LIKE ${month} and price between 801 and 900`;
  const query10 = `select count(*) as 901ToAbove from Product where MONTH(dateOfSale) LIKE ${month} and price >= 901`;

  // query one
  connection.query(query1, (error1, reslutOf0To100) => {
    if (error1) throw error1;
    // query two
    connection.query(query2, (error2, reslutOf101To200) => {
      if (error2) throw error2;
      // query three
      connection.query(query3, (error3, reslutOf201To300) => {
        if (error3) throw error3;
        // query four
        connection.query(query4, (error4, reslutOf301To400) => {
          if (error4) throw error4;
          // query five
          connection.query(query5, (error5, reslutOf401To500) => {
            if (error5) throw error5;
            // query six
            connection.query(query6, (error6, reslutOf501To600) => {
              if (error6) throw error6;
              // query seven
              connection.query(query7, (error7, reslutOf601To700) => {
                if (error7) throw error7;
                // query eight
                connection.query(query8, (error8, reslutOf701To800) => {
                  if (error8) throw error8;
                  // query nine
                  connection.query(query9, (error9, reslutOf801To900) => {
                    if (error9) throw error9;
                    // query ten
                    connection.query(query10, (error10, reslutOf901ToAbove) => {
                      if (error10) throw error10;
                      // send response
                      // response.send({
                      //   reslutOf0To100: reslutOf0To100[0]["0To100"],
                      //   reslutOf101To200: reslutOf101To200[0]["101To200"],
                      //   reslutOf201To300: reslutOf201To300[0]["201To300"],
                      //   reslutOf301To400: reslutOf301To400[0]["301To400"],
                      //   reslutOf401To500: reslutOf401To500[0]["401To500"],
                      //   reslutOf501To600: reslutOf501To600[0]["501To600"],
                      //   reslutOf601To700: reslutOf601To700[0]["601To700"],
                      //   reslutOf701To800: reslutOf701To800[0]["701To800"],
                      //   reslutOf801To900: reslutOf801To900[0]["801To900"],
                      //   reslutOf901ToAbove: reslutOf901ToAbove[0]["901ToAbove"],
                      // });
                      response.send([
                        { name: "0-100", countOf: reslutOf0To100[0]["0To100"] },
                        {
                          name: "101-200",
                          countOf: reslutOf101To200[0]["101To200"],
                        },
                        {
                          name: "201-300",
                          countOf: reslutOf201To300[0]["201To300"],
                        },
                        {
                          name: "301-400",
                          countOf: reslutOf301To400[0]["301To400"],
                        },
                        {
                          name: "401-500",
                          countOf: reslutOf401To500[0]["401To500"],
                        },
                        {
                          name: "501-600",
                          countOf: reslutOf501To600[0]["501To600"],
                        },
                        {
                          name: "601-700",
                          countOf: reslutOf601To700[0]["601To700"],
                        },
                        {
                          name: "701-800",
                          countOf: reslutOf701To800[0]["701To800"],
                        },
                        {
                          name: "801-900",
                          countOf: reslutOf801To900[0]["801To900"],
                        },
                        {
                          name: "901-above",
                          countOf: reslutOf901ToAbove[0]["901ToAbove"],
                        },
                      ]);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

app.get("/pieChart", (request, response) => {
  const { month } = request.query;
  const query = `select category , count(*) as ItemsCount from Product where MONTH(dateOfSale) LIKE ${month} group by category`;
  connection.query(query, (error, reslut) => {
    if (error) throw error;
    response.send(reslut);
  });
});

app.listen(process.env.PORT, () =>
  console.log(`server is running ${process.env.port}`)
);
