import { apiErrorHandler } from "service/NextApi/helper";
import { cancelOpenOrderApp } from "service/NextApi/private";

export default async function handler(req: any, res: any) {
  const data = req.body;
  try {
    if (req.method === "POST") {
      const response = await cancelOpenOrderApp(req, data);
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "404 not found", success: false });
    }
  } catch (error: any) {
    apiErrorHandler(error, res);
  }
}
