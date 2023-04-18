export const toDifficultyMap = (difficulty) => {
  switch (difficulty) {
    case 1:
      return "Easy";
    case 2:
      return "Medium";
    case 3:
      return "Hard";
    case 4:
      return "Expert";
  }
};

export default toDifficultyMap;
