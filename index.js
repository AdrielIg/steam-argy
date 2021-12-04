import {
  getLocalStorage,
  setLocalStorage,
  capitalizeFirstLetter,
  getTotal,
} from "./helpers.js";
import {
  buttonClearCart,
  buttonShowCart,
  buttonSeeAll,
  formBuy,
  formSearch,
  wrapperCards,
  modal,
  btn,
  span,
} from "./domElements.js";

const URLJSON = "./productos.json";

/* Productos */
let PRODUCTOS;
/* Cart */
let CARRITO = [];

(function () {
  const cartLocal = getLocalStorage("cart");
  if (cartLocal) {
    CARRITO = cartLocal;
  }
})();

(async function () {
  await fetch(URLJSON)
    .then((response) => response.json())
    .then((data) => {
      PRODUCTOS = data;
      return data.map(renderProductos);
    });
  addEvents();
})();

const renderProductos = (game) => {
  const contenedor = document.createElement("div");
  contenedor.classList.add("col-md-4", "col-xl-3");

  contenedor.innerHTML = ` <div class="card mt-4" style="width: 14rem;">
                             <img src=${game.img} class="card-img-top" alt=${
    game.name
  }/> 
                              <div class="card-body">
                                <h6 class="card-title">${game.name}</h6>
                                ${game.category.map(
                                  (cat) =>
                                    `<p class="badge bg-secondary">${cat}</p>`
                                )}
                                <p class="card-text ">$${game.price}</p>
                                <button id=${
                                  game.key
                                }  class="btn btn-primary buy-game">Buy Game</button>
                              </div>
                            </div>`;
  wrapperCards.appendChild(contenedor);
};

const searchGameByName = async (name) => {
  wrapperCards.innerHTML = "";
  const game = await PRODUCTOS.find((game) => game.name.includes(name));
  renderProductos(game);
  addEvents();
};

const addEvents = () => {
  const buttons = document.querySelectorAll(".buy-game");
  buttons.forEach((button) =>
    button.addEventListener("click", async ({ target }) => {
      await addToCart(target.id);
      setLocalStorage(CARRITO, "cart");
      showItems();
    })
  );
};

buttonSeeAll.addEventListener("click", () => {
  wrapperCards.innerHTML = "";
  PRODUCTOS.map(renderProductos);
  addEvents();
});

/* Search game by key*/
const searchGameByKey = (key, place = PRODUCTOS) => {
  return place.find((producto) => producto.key === parseInt(key));
};

/* If the game already in the cart */
const isAlreadyInCart = (key) => {
  const existGame = searchGameByKey(key, CARRITO);
  return Boolean(existGame);
};
/* Add to cart */
const addToCart = async (key) => {
  Swal.fire({
    icon: "success",
    title: "Producto agregado al carrito",
    toast: true,
    position: "bottom-end",
    timer: 5000,
    timerProgressBar: true,
    showCloseButton: true,
    showConfirmButton: false,
  });
  if (isAlreadyInCart(key)) {
    const game = searchGameByKey(key, CARRITO);
    game.quantity += 1;
    return;
  }
  const gameSearched = await searchGameByKey(key);
  await CARRITO.push({ ...gameSearched, quantity: 1 });
};

/* Show cart items in dom */
const showItems = () => {
  buttonShowCart.innerHTML = "Update Cart";
  const list = document.querySelector(".items-cart");
  const totalValue = document.querySelector(".total");
  const total = getTotal();
  totalValue.innerHTML = `Total: $${total}`;
  list.innerHTML = "";
  (getLocalStorage("cart") || []).map((item) => {
    const listItem = document.createElement("li");
    listItem.className = "item-cart ";
    listItem.innerHTML = `<div class='item-cart-wrapper'>
                            <img class="item-img" src=${item.img} />
                            <div class='item-desc'> 
                              <h4>${item.name} </h4>
                              <p>Items: ${item.quantity} </p>
                            
                            </div>
                          </div>
                            <hr>`;

    list.appendChild(listItem);
  });
};

const renderOnBuy = (game) => {
  const cartListWrapper = document.querySelector(".cart-list");

  const contenedorList = document.createElement("div");
  contenedorList.classList.add("col-sm");

  contenedorList.innerHTML = ` <div class="card m-2" style="width: 10.2rem;">
                             <img src=${game.img} class="card-img-top" alt=${game.name}> 
                              <div class="card-body">
                                <h6 class="card-title">Title: <span class='badge bg-secondary' >${game.name}</span> </h6>
                                <p class="card-text ">Price: <span class='badge bg-secondary'>$${game.price}</span> </p>
                                <p>Items: <span class="badge bg-secondary">${game.quantity}</span></p>
                              </div>
                            </div>`;
  cartListWrapper.appendChild(contenedorList);
};

const emptyCart = () => {
  const list = document.querySelector(".items-cart");
  list.innerHTML = "";
  const totalValue = document.querySelector(".total");
  totalValue.innerHTML = "Total: $0";
  localStorage.clear();
  CARRITO = [];
};

/* Events Listeners */
formSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = document.querySelector("#inputBuscador").value;
  searchGameByName(capitalizeFirstLetter(inputValue));
});
buttonShowCart.addEventListener("click", showItems);

formBuy.addEventListener("submit", (e) => {
  e.preventDefault();
  Swal.fire(
    "Congratulations! ",
    "The purchase has been made successfully",
    "success"
  );
  modal.style.display = "none";
  emptyCart();
});

buttonClearCart.addEventListener("click", () => {
  emptyCart();
  Swal.fire("Cart Empty", "All the items in the cart were deleted", "success");
});

// When the user clicks the button, open the modal
btn.onclick = function () {
  const cartListWrapper = document.querySelector(".cart-list");
  cartListWrapper.innerHTML = "";
  modal.style.display = "block";

  CARRITO.map(renderOnBuy);
  const total = document.querySelector(".total-buy-cart");
  total.className = "alert alert-primary";
  total.innerHTML = `Total: $${getTotal()}`;
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
