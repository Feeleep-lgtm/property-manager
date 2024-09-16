import { sendComplain } from "./complain.js";

export const submitComplaint = async (req, res) => {
  console.log(req.user); // Debug: Check if req.user is populated
  const { id: userId } = req.user;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  // Extract complaint details from request body
  const { property, contactCaretaker, complain } = req.body;

  try {
    const newComplaint = await sendComplain(
      userId,
      property,
      contactCaretaker,
      complain
    );
    res.status(200).json({ success: true, data: newComplaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
