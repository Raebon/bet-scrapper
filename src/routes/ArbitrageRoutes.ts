import express, { Router } from "express";
import { FootbalController } from "../controllers/FootbalControllers";
import { TennisController } from "../controllers/TennisControllers";

class ArbitrageRoutes {
  private footbalController;
  private tennisController;
  public router: Router = express.Router();
  constructor() {
    this.footbalController = new FootbalController();
    this.tennisController = new TennisController();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get("/footbal", this.footbalController.getData);
    this.router.get("/tennis", this.tennisController.getData);
  }
}
export default new ArbitrageRoutes().router;
