import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import ArbitrageRoutes from "./routes/ArbitrageRoutes";
import { FootbalService } from "./services/footbal";

const app = express();
app.use(cors());
app.use(morgan(":method :url :status :response-time "));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const main = async () => {
  /*   const data = await FootbalService.evaluate(
    "https://www.tipsport.cz/kurzy/fotbal/fotbal-muzi/1-ceska-liga-120",
    "https://www.ifortuna.cz/sazeni/fotbal/fortuna-liga"
  );
  console.log(data!.result); */
};
main();

app.use("/arbitrage", ArbitrageRoutes);
app.listen(4000, () => {
  console.log(`App running on port 4000.`);
});
