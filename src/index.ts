import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import ArbitrageRoutes from "./routes/ArbitrageRoutes";

const app = express();
app.use(cors());
app.use(morgan(":method :url :status :response-time "));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/arbitrage", ArbitrageRoutes);
app.listen(4000, () => {
  console.log(`App running on port 4000.`);
});
