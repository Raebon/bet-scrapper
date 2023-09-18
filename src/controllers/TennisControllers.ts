import { Request, Response } from "express";
import { TennisService } from "../services/tennis";
import { ArbitrageLinksParams } from "./interfaces";

export class TennisController {
  constructor() {}

  public async getData(
    req: Request<any, any, any, ArbitrageLinksParams>,
    res: Response
  ) {
    const params: ArbitrageLinksParams = req.query;
    try {
      const data = await TennisService.evaluate(
        params.tipsport,
        params.fortuna
      );
      return res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({
        data: null,
      });
    }
  }
}
