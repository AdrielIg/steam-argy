export const setLocalStorage = (item, name) => {
  localStorage.setItem(name, JSON.stringify(item));
};
export const getLocalStorage = (name) => {
  return JSON.parse(localStorage.getItem(name));
};
export function capitalizeFirstLetter(string) {
  string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getTotal = () => {
  let total = 0;
  const itemsLocalStroage = getLocalStorage("cart");
  if (itemsLocalStroage)
    getLocalStorage("cart").map((game) => {
      if (game.quantity > 1) {
        total += game.quantity * game.price;
      }
      if (game.quantity <= 1) total += game.price;
    });
  return total;
};

export const emptyCart = () => {
  const list = document.querySelector(".items-cart");
  list.innerHTML = "";
  const totalValue = document.querySelector(".total");
  totalValue.innerHTML = "Total: $0";
  localStorage.clear();
  CARRITO = [];
};
