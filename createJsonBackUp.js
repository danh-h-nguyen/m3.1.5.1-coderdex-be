const fs = require("fs");
const csvtojson = require("csvtojson");

const createJson = async () => {
  let newData = await csvtojson().fromFile("pokemon.csv");

  newData = Array.from(newData);

  newData = newData.map((pokemon, index) => ({
    id: index + 1,
    name: pokemon.Name.toLowerCase(),
    types: [pokemon.Type1.toLowerCase(), pokemon.Type2.toLowerCase()],
    // url: `http://localhost:5000/images/${index + 1}.png`,
  }));

  console.log(newData.slice(0, 3));
  // let data = JSON.parse(fs.readFileSync("pokemon.json"));

  // data.data = newData;
  fs.writeFileSync("pokemon.json", JSON.stringify(newData));
};

// createJson();
