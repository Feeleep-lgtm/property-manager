const blacklist = new Set();

export const addToBlacklist = async (token) => {
  blacklist.add(token);
};

export const isBlacklisted = (token) => {
  return blacklist.has(token);
};
