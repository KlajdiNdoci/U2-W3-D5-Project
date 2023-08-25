const URL = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4NTNlZGMwMzRmZjAwMTQwM2Y0ZDYiLCJpYXQiOjE2OTI5NjE3MDUsImV4cCI6MTY5NDE3MTMwNX0.sFXYgO6SShVp7n5B4zTC6XoYAg2P9idUKV97uxp_IjQ";

const handleSubmit = function handleSubmit(event) {
  event.preventDefault();

  const carName = document.getElementById("carName").value;
  const carBrand = document.getElementById("carBrand").value;
  const carDescription = document.getElementById("description").value;
  const carPrice = document.getElementById("price").value;
  const carImageUrl = document.getElementById("imageUrl").value;

  const newCar = {
    name: carName,
    brand: carBrand,
    description: carDescription,
    price: carPrice,
    imageUrl: carImageUrl,
  };

  fetch(URL, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCar),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Nuova macchina inserita:", data);
      alert("La macchina è stata inserita correttamente.");
      document.getElementById("carName").value = "";
      document.getElementById("carBrand").value = "";
      document.getElementById("description").value = "";
      document.getElementById("price").value = "";
      document.getElementById("imageUrl").value = "";
    })
    .catch(error => {
      console.log("Errore durante l'inserimento della macchina:", error);
    });
};
document.addEventListener("DOMContentLoaded", function () {
  const createBtn = document.getElementById("create-btn");
  if (createBtn) {
    createBtn.addEventListener("click", handleSubmit);
  }
});

const createCard = car => {
  const card = document.createElement("div");
  card.setAttribute("data-product-id", car._id);

  card.className = "card mb-4 col-2 col-md-4 shadow-sm p-0";

  card.innerHTML = `
    <img src="${car.imageUrl}" alt="${car.name}" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">${car.name}</h5>
      <p class="card-text">${car.description}</p>
      <div class="d-flex justify-content-between align-items-center">
        <span class="price">${car.price} €</span>
        <button class="btn btn-primary" onclick="editProduct('${car._id}')">Modifica</button>
        <button class="btn btn-success" onclick="editProduct('${car._id}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteProduct('${car._id}')">Delete</button>


      </div>
    </div>
  `;

  return card;
};

document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.getElementById("carCards");

  fetch(URL, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(car => {
        const card = createCard(car);
        cardContainer.appendChild(card); // Aggiungi la card al container
      });
    })
    .catch(error => {
      console.log("Errore durante il recupero delle macchine:", error);
    });
});

const editProduct = async productId => {
  // Fetch the existing product details using the product ID
  const response = await fetch(`${URL}${productId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  if (response.ok) {
    const product = await response.json();

    // Populate the form fields with the existing product details
    document.getElementById("carName").value = product.name;
    document.getElementById("carBrand").value = product.brand;
    document.getElementById("description").value = product.description;
    document.getElementById("price").value = product.price;
    document.getElementById("imageUrl").value = product.imageUrl;

    // Add a hidden input field to store the product ID for updating
    const productIdInput = document.createElement("input");
    productIdInput.type = "hidden";
    productIdInput.id = "productId";
    productIdInput.value = productId;

    // Append the hidden input field to the form
    const carForm = document.getElementById("carForm");
    carForm.appendChild(productIdInput);

    // Change the submit button to an "Update" button
    const createBtn = document.getElementById("create-btn");
    createBtn.textContent = "Update";
    createBtn.removeEventListener("click", handleSubmit);
    createBtn.addEventListener("click", updateProduct);
  }
};

const deleteProduct = async productId => {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${URL}${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      // Remove the product card from the UI
      const productCard = document.querySelector(`[data-product-id="${productId}"]`);
      if (productCard) {
        productCard.remove();
      }
    } else {
      console.log("Error deleting product:", response.statusText);
    }
  } catch (error) {
    console.log("Error deleting product:", error);
  }
};
