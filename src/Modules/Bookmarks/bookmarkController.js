import * as bookmarkService from "./bookmarkService.js";

// Add Bookmark Controller
export const addBookmark = async (req, res) => {
  try {
    const tenantId = req.user.id; // Extract tenantId from the authenticated user
    const { propertyId } = req.body;

    const bookmark = await bookmarkService.addBookmark(tenantId, propertyId);
    res.status(201).json(bookmark);
  } catch (error) {
    console.error("Error adding bookmark:", error.message);
    res.status(500).json({
      message: error.message || "An error occurred while adding bookmark",
    });
  }
};

// Get Bookmarks for a Tenant Controller
export const getBookmarksForTenantController = async (req, res) => {
  try {
    const tenantId = req.user.id; // Extract tenantId from the authenticated user

    const bookmarks = await bookmarkService.getBookmarksForTenant(tenantId);
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error.message);
    res.status(500).json({
      message: error.message || "An error occurred while fetching bookmarks",
    });
  }
};

export const deleteBookmark = async (req, res) => {
  const { userId } = req.user; // Extract tenantId from the token
  const { propertyId } = req.body; // Get propertyId from the request body

  try {
    await bookmarkService.deleteBookmark(userId, propertyId);
    res.status(200).json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting bookmark", error: error.message });
  }
};
