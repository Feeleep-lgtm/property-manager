export const loadSkeleton = (req, res) => {
  const skeletonData = {
    sections: [
      { id: 1, title: "Section 1", items: Array(10).fill({}) },
      { id: 2, title: "Section 2", items: Array(10).fill({}) },
      { id: 3, title: "Section 3", items: Array(10).fill({}) },
    ],
  };

  res.status(200).json(skeletonData);
};
