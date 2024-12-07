import axios from "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

axios.defaults.headers.common["x-api-key"] = "live_vmWvrfcDs3CnvnKyMuLba85wHc21tpjjjTSkMLvO3EHQNWS7fJFnhtHCXPsl9DAP";

const breedSelect = document.querySelector(".breed-select");
const loader = document.querySelector(".loader");
const error = document.querySelector(".error");
const catInfo = document.querySelector(".cat-info");

async function fetchBreeds() {
  try {
    loader.style.display = "block";
    error.style.display = "none";

    const response = await axios.get("https://api.thecatapi.com/v1/breeds");
    const breeds = response.data;

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    loader.style.display = "none";
  } catch (err) {
    console.error("Error fetching breeds:", err);
    error.style.display = "block";
    loader.style.display = "none";
  }
}

async function fetchCatByBreed(breedId) {
  try {
    loader.style.display = "block";
    error.style.display = "none";

    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    const cat = response.data[0];

    catInfo.innerHTML = `
      <img src="${cat.url}" alt="Cat" style="max-width: 100%; height: auto; margin: 20px 0;">
      <h2>${cat.breeds[0].name}</h2>
      <p>${cat.breeds[0].description}</p>
      <p><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
    `;

    catInfo.style.display = "block";
    loader.style.display = "none";
  } catch (err) {
    console.error("Error fetching cat details:", err);
    error.style.display = "block";
    loader.style.display = "none";
  }
}

breedSelect.addEventListener("change", (event) => {
  const breedId = event.target.value;

  if (breedId) {
    fetchCatByBreed(breedId);
  } else {
    catInfo.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchBreeds();
});
