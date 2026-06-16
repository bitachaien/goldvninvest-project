import { apiErrorHandler } from "service/NextApi/helper";
import { getReferalHistory } from "service/NextApi/private";

export default async function handler(req: any, res: any) {
  const query = req.query;
  try {
    if (req.method === "GET") {
      const response = await getReferalHistory(req, query);
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "404 not found", success: false });
    }
  } catch (error: any) {
    apiErrorHandler(error, res);
  }
}
