import { prisma } from "../../../app.js";

// Add Bookmark Service
export const addBookmark = async (tenantId, propertyId) => {
  try {
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        tenantId,
        propertyId,
      },
    });

    if (existingBookmark) {
      throw new Error("Property already bookmarked");
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        tenantId,
        propertyId,
      },
    });

    return bookmark;
  } catch (error) {
    console.error("Error adding bookmark:", error.message);
    throw error;
  }
};

// Get Bookmarks for a Tenant Service
export const getBookmarksForTenant = async (tenantId) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        tenantId,
      },
      include: {
        property: true,
      },
    });

    return bookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error.message);
    throw error;
  }
};

// Delete Bookmark Service
export const deleteBookmark = async (tenantId, propertyId) => {
  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        tenantId,
        propertyId,
      },
    });

    if (!bookmark) {
      throw new Error("Bookmark not found");
    }

    await prisma.bookmark.delete({
      where: {
        id: bookmark.id,
      },
    });
  } catch (error) {
    throw new Error("Error deleting bookmark: " + error.message);
  }
};
