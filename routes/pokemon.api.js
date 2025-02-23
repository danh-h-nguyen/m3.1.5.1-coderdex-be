const fs = require("fs");

const express = require("express");
const router = express.Router();

// Helper function để đọc dữ liệu từ pokemon.json
const readJson = () => {
  try {
    const data = fs.readFileSync("pokemon.json", "utf-8");
    return JSON.parse(data); // Lấy dữ liệu từ phần 'data' trong JSON
  } catch (error) {
    throw new Error("Error reading JSON file");
  }
};

// Helper function để ghi dữ liệu vào pokemon.json
const writeJson = (pokemons) => {
  try {
    const jsonData = { data: pokemons };
    fs.writeFileSync("pokemon.json", JSON.stringify(jsonData, null, 2)); // Ghi vào file pokemon.json
  } catch (error) {
    throw new Error("Error writing JSON file");
  }
};

// 1. API lấy tất cả Pokémons
router.get("/", async (req, res, next) => {
  try {
    const { page, limit, ...filterQuery } = req.query;
    let pokemons = await readJson();

    // Phân trang
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    let offset = limitNum * (pageNum - 1);

    // Lọc dữ liệu theo các tham số
    Object.keys(filterQuery).forEach((key) => {
      pokemons = pokemons.filter(
        (pokemon) =>
          String(pokemon[key]).toLowerCase() ===
          String(filterQuery[key]).toLowerCase()
      );
    });

    // Phân trang
    const result = pokemons.slice(offset, offset + limitNum);
    res.status(200).send({ data: result });
  } catch (error) {
    next(error);
  }
});

// 2. API lấy thông tin của 1 Pokémon
// router.get("/:pokemonId", async (req, res, next) => {
//   try {
//     const { pokemonId } = req.params;
//     const pokemons = await readCsv();
//     const pokemon = pokemons.find(
//       (p) => p.Name.toLowerCase() === pokemonId.toLowerCase()
//     );
//     if (!pokemon) {
//       const exception = new Error(`Pokemon with name ${pokemonId} not found`);
//       exception.statusCode = 404;
//       throw exception;
//     }
//     res.status(200).send({
//       data: [
//         {
//           id: pokemons.indexOf(pokemon) + 1,
//           name: pokemon.Name.toLowerCase(),
//           types: [pokemon.Type1.toLowerCase(), pokemon.Type2.toLowerCase()],
//           url: `http://localhost:5000/images/${
//             pokemons.indexOf(pokemon) + 1
//           }.png`,
//         },
//       ],
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// 3. API tạo mới một Pokémon
// router.post("/", async (req, res, next) => {
//   try {
//     const { name, type1, type2, evolution } = req.body;
//     if (!name || !type1 || !type2 || !evolution) {
//       const exception = new Error("Missing required fields");
//       exception.statusCode = 400;
//       throw exception;
//     }

//     const newPokemon = {
//       Name: name,
//       Type1: type1,
//       Type2: type2,
//       Evolution: evolution,
//     };

//     const pokemons = await readCsv();
//     pokemons.push(newPokemon);
//     writeJson(pokemons); // Ghi lại dữ liệu vào file JSON

//     res.status(201).send({
//       data: [
//         {
//           id: pokemons.length,
//           name: newPokemon.Name.toLowerCase(),
//           types: [
//             newPokemon.Type1.toLowerCase(),
//             newPokemon.Type2.toLowerCase(),
//           ],
//           url: `http://localhost:5000/images/${pokemons.length}.png`,
//         },
//       ],
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// 4. API cập nhật thông tin của một Pokémon
// router.put("/:pokemonId", async (req, res, next) => {
//   try {
//     const { pokemonId } = req.params;
//     const updates = req.body;

//     const pokemons = await readCsv();
//     const pokemonIndex = pokemons.findIndex(
//       (p) => p.Name.toLowerCase() === pokemonId.toLowerCase()
//     );
//     if (pokemonIndex < 0) {
//       const exception = new Error(`Pokemon not found`);
//       exception.statusCode = 404;
//       throw exception;
//     }

//     const updatedPokemon = { ...pokemons[pokemonIndex], ...updates };
//     pokemons[pokemonIndex] = updatedPokemon;
//     writeJson(pokemons); // Ghi lại dữ liệu vào file JSON

//     res.status(200).send({
//       data: [
//         {
//           id: pokemonIndex + 1,
//           name: updatedPokemon.Name.toLowerCase(),
//           types: [
//             updatedPokemon.Type1.toLowerCase(),
//             updatedPokemon.Type2.toLowerCase(),
//           ],
//           url: `http://localhost:5000/images/${pokemonIndex + 1}.png`,
//         },
//       ],
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// 5. API xóa một Pokémon theo ID
// router.delete("/:pokemonId", async (req, res, next) => {
//   try {
//     const { pokemonId } = req.params;

//     const pokemons = await readCsv();
//     const pokemonIndex = pokemons.findIndex(
//       (p) => p.Name.toLowerCase() === pokemonId.toLowerCase()
//     );
//     if (pokemonIndex < 0) {
//       const exception = new Error(`Pokemon not found`);
//       exception.statusCode = 404;
//       throw exception;
//     }

//     pokemons.splice(pokemonIndex, 1);
//     writeJson(pokemons); // Ghi lại dữ liệu vào file JSON

//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
