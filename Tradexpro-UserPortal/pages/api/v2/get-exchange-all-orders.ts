import { apiErrorHandler } from "service/NextApi/helper";
import { getExchangeAllOrdersApp } from "service/NextApi/public";

export default async function handler(req: any, res: any) {
  const query = req.query;
  try {
    if (req.method === "GET") {
      const response = await getExchangeAllOrdersApp(req, query);
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "404 not found", success: false });
    }
  } catch (error: any) {
    apiErrorHandler(error, res);
  }
}
