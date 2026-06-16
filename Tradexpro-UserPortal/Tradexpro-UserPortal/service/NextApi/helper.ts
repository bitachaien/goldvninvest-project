export const apiErrorHandler = (error: any, res: any) => {
  if (error?.response?.status == 401) {
    res.status(401).json({ message: "Unauthorized", success: false });
  }
  if (error?.response?.status == 500) {
    res.status(500).json({ message: "Something Went Wrong", success: false });
  }
  if (error?.response?.status == 404) {
    res.status(404).json({ message: "Not Found", success: false });
  }
};
