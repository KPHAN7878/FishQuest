const speciesToColor = (species) => {
  switch (species) {
    case "Bluegill":
      return "lightblue";
    case "Catfish":
      return "slategray";
    case "Carp":
      return "wheat";
    case "Largemouth bass":
      return "palegreen";
    case "Gar":
      return "yellowgreen";
    case "Crappie":
      return "lightslategrey";
    default:
      return "lightgray";
  }
};

export const speciesList = new Set([
  "Crappie",
  "Gar",
  "Carp",
  "Catfish",
  "Bluegill",
  "Largemouth bass",
]);
export default speciesToColor;
