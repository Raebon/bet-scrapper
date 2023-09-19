import { Request, Response } from "express";
import { FootbalService } from "../services/footbal";
import { ArbitrageLinksParams } from "./interfaces";

export class FootbalController {
  constructor() {}

  public async getData(
    req: Request<any, any, any, ArbitrageLinksParams>,
    res: Response
  ) {
    const params: ArbitrageLinksParams = req.query;
    try {
      const data = await FootbalService.evaluate(
        params.tipsport,
        params.fortuna,
        params.newEvaluation,
        params.desiredBet
      );
      return res.status(200).send({ data });
    } catch (error) {
      res.status(500).send({
        data: null,
      });
    }
  }
}
