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
  const spinner = document.getElementById("spinner");
  spinner.classList.add("d-none");

  card.className = "card mb-4 col-12 col-md-4  shadow-sm p-0";

  card.innerHTML = `
    <img src="${car.imageUrl}" alt="${car.name}" class="card-img-top object-fit-cover " height="200px">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${car.name}</h5>
      <p class="card-text">${car.description}</p>
      <p class="price">${car.price} €</p>
      <div class="d-flex justify-content-between align-items-center mt-auto ">
   
        <button id="edit-mode-btn" class="btn btn-primary "><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg></button>
        <button id="edit-btn" class="btn btn-success d-none" >Edit</button>
        <button id="delete-btn" class="btn btn-danger d-none" onclick="deleteProduct('${car._id}')">Delete</button>



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
        cardContainer.appendChild(card);
        const editModeBtn = document.getElementById("edit-mode-btn");
        const editBtn = document.getElementById("edit-btn");
        const deleteBtn = document.getElementById("delete-btn");
        editModeBtn.addEventListener("click", function () {
          editBtn.classList.remove("d-none");
          deleteBtn.classList.remove("d-none");
          editModeBtn.classList.add("d-none");
        });
      });
    })
    .catch(error => {
      console.log("Errore durante il recupero delle macchine:", error);
    });
});

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
