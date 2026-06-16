import { apiErrorHandler } from "service/NextApi/helper";
import { getAppDashboardData } from "service/NextApi/public";

export default async function handler(req: any, res: any) {
  try {
    const { pair } = req.query;
    if (req.method === "GET") {
      const response = await getAppDashboardData(req, pair);
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "404 not found", success: false });
    }
  } catch (error: any) {
    apiErrorHandler(error, res);
  }
}
