const URL = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4NTNlZGMwMzRmZjAwMTQwM2Y0ZDYiLCJpYXQiOjE2OTI5NjE3MDUsImV4cCI6MTY5NDE3MTMwNX0.sFXYgO6SShVp7n5B4zTC6XoYAg2P9idUKV97uxp_IjQ";

const handleSubmit = function handleSubmit(event) {
  event.preventDefault();

  const form = document.getElementById("carForm");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

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

const createCard = car => {
  const card = document.createElement("div");
  card.setAttribute("data-product-id", car._id);
  const spinner = document.getElementById("spinner");
  spinner.classList.add("d-none");

  card.className = "col ";

  card.innerHTML = `
   <div  class="card">
      <img src="${car.imageUrl}" alt="${car.name}" class="card-img-top object-fit-cover " height="200px">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${car.name}</h5>
        <p class="card-text">${car.description}</p>
        <p class="price">${car.price} €</p>
        <div class="d-flex justify-content-between align-items-center mt-auto ">
          <button class="edit-mode-btn btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg></button>
          <a href="./Back-office.html?carId=${car._id}" class="text-decoration-none text-white"><button class="edit-btn btn btn-success d-none" data-toggle="modal" data-target="#editModal">Modifica</button></a>
          <button class="delete-btn btn btn-danger d-none" onclick="deleteProduct('${car._id}')">Rimuovi</button>
        </div>
      </div>
   </div>
  `;

  return card;
};

document.addEventListener("DOMContentLoaded", function () {
  const isHomePage = window.location.pathname.includes("Homepage.html");
  const createBtn = document.getElementById("create-btn");
  if (createBtn) {
    createBtn.addEventListener("click", handleSubmit);
  }

  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function (event) {
      const confirmed = confirm("Sei sicuro di voler resettare il modulo?");
      if (!confirmed) {
        event.preventDefault();
      }
    });
  }

  if (isHomePage) {
    const spinner = document.getElementById("spinner");
    const cardContainer = document.getElementById("carCards");

    fetch(URL, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then(response => response.json())
      .then(data => {
        spinner.classList.add("d-none");
        data.forEach(car => {
          const card = createCard(car);
          cardContainer.appendChild(card);
          const editModeBtn = card.querySelector(".edit-mode-btn");
          const editBtn = card.querySelector(".edit-btn");
          const deleteBtn = card.querySelector(".delete-btn");

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
  }
});

const deleteProduct = async productId => {
  const confirmDelete = confirm("Sei sicuro di voler eliminare questo prodotto?");
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

const carId = new URLSearchParams(window.location.search).get("carId");

window.onload = async () => {
  if (carId !== null) {
    try {
      const resp = await fetch(`${URL}${carId}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (resp.ok) {
        const carObj = await resp.json();

        const { name, brand, description, price, imageUrl } = carObj;
        const title = document.getElementById("title");
        const createBtn = document.getElementById("create-btn");
        const editCarBtn = document.getElementById("edit-car-btn");
        const resetBtn = document.getElementById("reset-btn");

        title.innerText = "Modifica macchina";

        document.getElementById("carName").value = name;
        document.getElementById("carBrand").value = brand;
        document.getElementById("description").value = description;
        document.getElementById("price").value = price;
        document.getElementById("imageUrl").value = imageUrl;

        createBtn.classList.add("d-none");
        resetBtn.classList.add("d-none");
        editCarBtn.classList.remove("d-none");
      } else {
        console.log("Errore nella richiesta GET:", resp.status, resp.statusText);
      }
    } catch (error) {
      console.log("Errore durante la richiesta GET:", error);
    }
  }
};

const editCarBtn = document.getElementById("edit-car-btn");
editCarBtn.addEventListener("click", handleEditCar);

async function handleEditCar(event) {
  event.preventDefault();

  const carName = document.getElementById("carName").value;
  const carBrand = document.getElementById("carBrand").value;
  const carDescription = document.getElementById("description").value;
  const carPrice = document.getElementById("price").value;
  const carImageUrl = document.getElementById("imageUrl").value;

  const updatedCar = {
    name: carName,
    brand: carBrand,
    description: carDescription,
    price: carPrice,
    imageUrl: carImageUrl,
  };

  try {
    const response = await fetch(`${URL}${carId}`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCar),
    });

    if (response.ok) {
      alert("La macchina è stata modificata correttamente.");
    }
  } catch (error) {
    console.log("Error updating car:", error);
  }
}
