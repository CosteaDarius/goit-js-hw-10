const addStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .hidden {
      display: none;
    }
    .loader {
      font-size: 18px;
      text-align: center;
      margin-top: 20px;
    }
    .breed-select {
      margin: 20px 0;
      padding: 10px;
      font-size: 16px;
    }
    .cat-info {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-top: 20px;
    }
    .cat-info img {
      max-width: 300px;
      border-radius: 8px;
    }
    .error {
      color: red;
      font-size: 16px;
      text-align: center;
      margin-top: 20px;
    }
  `;
  document.head.appendChild(style);
};

addStyles();

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const errorElement = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

const API_KEY =
  'live_vmWvrfcDs3CnvnKyMuLba85wHc21tpjjjTSkMLvO3EHQNWS7fJFnhtHCXPsl9DAP';
const BASE_URL = 'https://api.thecatapi.com/v1';

const showLoader = () => loader.classList.remove('hidden');
const hideLoader = () => loader.classList.add('hidden');
const showError = message => {
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
};
const hideError = () => errorElement.classList.add('hidden');

const fetchBreeds = async () => {
  showLoader();
  try {
    const response = await fetch(`${BASE_URL}/breeds`, {
      headers: { 'x-api-key': API_KEY },
    });
    const data = await response.json();
    hideLoader();
    populateBreeds(data);
  } catch (error) {
    hideLoader();
    showError('A apărut o eroare la încărcarea raselor. Reîncercați.');
  }
};

const populateBreeds = breeds => {
  const options = breeds
    .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
    .join('');
  breedSelect.innerHTML = options;
};

const fetchCatDetails = async breedId => {
  showLoader();
  hideError();
  try {
    const response = await fetch(
      `${BASE_URL}/images/search?breed_ids=${breedId}`,
      {
        headers: { 'x-api-key': API_KEY },
      }
    );
    const [cat] = await response.json();
    hideLoader();
    displayCatDetails(cat);
  } catch (error) {
    hideLoader();
    showError('A apărut o eroare la încărcarea informațiilor. Reîncercați.');
  }
};

const displayCatDetails = cat => {
  catInfo.innerHTML = `
    <img src="${cat.url}" alt="Imagine pisică" style="max-width: 300px;">
    <div>
      <h2>${cat.breeds[0].name}</h2>
      <p>${cat.breeds[0].description}</p>
      <p><strong>Temperament:</strong> ${cat.breeds[0].temperament}</p>
    </div>
  `;
  catInfo.classList.remove('hidden');
};

breedSelect.addEventListener('change', event => {
  const breedId = event.target.value;
  if (breedId) {
    fetchCatDetails(breedId);
  }
});

fetchBreeds();
