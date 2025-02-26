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
    fs.writeFileSync("pokemon.json", JSON.stringify(jsonData)); // Ghi vào file pokemon.json
  } catch (error) {
    throw new Error("Error writing JSON file");
  }
};

// 1. API lấy tất cả Pokémons
router.get("/", async (req, res, next) => {
  try {
    const { page, limit, search, type, ...filterQuery } = req.query;
    let pokemons = await readJson();

    // Phân trang
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    let offset = limitNum * (pageNum - 1);

    // Xử lý tìm kiếm theo tên hoặc id
    if (search) {
      pokemons = pokemons.data;
      if (!isNaN(parseInt(search))) {
        pokemons = pokemons.filter((pokemon) =>
          String(pokemon.id).includes(search)
        );
      } else {
        pokemons = pokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      pokemons = { data: pokemons };
    }

    // Xử lý lọc theo type
    if (type) {
      pokemons = pokemons.data;
      pokemons = pokemons.filter(
        (pokemon) =>
          pokemon.types[0].toLowerCase().includes(type.toLowerCase()) ||
          pokemon.types[1].toLowerCase().includes(type.toLowerCase())
      );
      pokemons = { data: pokemons };
    }

    Object.keys(filterQuery).forEach((key) => {
      pokemons = pokemons.data.filter(
        (pokemon) =>
          String(pokemon[key]).toLowerCase() ===
          String(filterQuery[key]).toLowerCase()
      );
    });

    // Phân trang
    const result = pokemons.data.slice(offset, offset + limitNum);
    res.status(200).send({ data: result });
  } catch (error) {
    next(error);
  }
});

// 2. API lấy thông tin của 1 Pokémon
router.get("/:pokemonId", async (req, res, next) => {
  try {
    const { pokemonId } = req.params;
    const pokemons = await readJson();

    const currentPokemonId = parseInt(pokemonId);
    const totalPokemons = pokemons.data.length;
    const pokemon = pokemons.data.find((p) => p.id === currentPokemonId);
    const nextPokemon = pokemons.data.find(
      (p) =>
        p.id ===
        (currentPokemonId + 1 > totalPokemons ? 1 : currentPokemonId + 1)
    );
    const previousPokemon = pokemons.data.find(
      (p) =>
        p.id ===
        (currentPokemonId - 1 < 1 ? totalPokemons : currentPokemonId - 1)
    );

    if (!pokemon) {
      const exception = new Error(`Pokemon with ID ${pokemonId} not found`);
      exception.statusCode = 404;
      throw exception;
    }

    res.status(200).send({ data: { pokemon, nextPokemon, previousPokemon } });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 3. API tạo mới một Pokémon
router.post("/", async (req, res, next) => {
  try {
    const { name, id, imgUrl, types } = req.body;

    if (!types || types.length < 2) {
      const exception = new Error("Missing types information");
      exception.statusCode = 400;
      throw exception;
    }

    const newPokemon = {
      id: parseInt(id),
      name: name,
      types: [types[0].toLowerCase(), types[1].toLowerCase()],
      url: imgUrl,
    };

    const pokemons = await readJson();
    pokemons.data.push(newPokemon);
    writeJson(pokemons.data);

    res.status(201).send({ data: newPokemon });
  } catch (error) {
    next(error);
  }
});

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
