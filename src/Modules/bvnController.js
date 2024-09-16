import axios from "axios";

export const verifyBVN = async (req, res) => {
  const { bvn, businessId } = req.body;

  if (!bvn || !businessId) {
    return res
      .status(400)
      .json({ success: false, message: "BVN and businessId are required" });
  }

  try {
    const response = await axios.post(
      "https://api.fincra.com/core/bvn-verification",
      {
        bvn: bvn,
        business: businessId,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_API_KEY`, // replace with your actual API key
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: error.response ? error.response.data.message : error.message,
      });
  }
};
