const fs = require("fs");
const csvtojson = require("csvtojson");
const path = require("path");

const createJson = async () => {
  let newData = await csvtojson().fromFile("pokemon.csv");

  // Lấy danh sách tất cả các file trong thư mục images
  const imageFolderPath = path.join(__dirname, "pokemon_jpg");
  const imageFiles = fs.readdirSync(imageFolderPath);

  newData = Array.from(newData);

  newData = newData.map((pokemon, index) => {
    const imageFileName = `${index + 1}.jpg`;
    const imageExists = imageFiles.includes(imageFileName);

    // Nếu hình ảnh tồn tại, thêm trường URL, nếu không để trống
    if (imageExists) {
      return {
        id: index + 1,
        name: pokemon.Name.toLowerCase(),
        types: [pokemon.Type1.toLowerCase(), pokemon.Type2.toLowerCase()],
        url: `https://m3-1-5-1-coderdex-be.onrender.com/pokemon_jpg/${imageFileName}`,
      };
    }
    return null;
  });

  newData = newData.filter((pokemon) => pokemon !== null);

  newData = { data: newData };

  fs.writeFileSync("pokemon.json", JSON.stringify(newData));
};

createJson();

// https://m3-1-5-1-coderdex-be.onrender.com
