//////////////
// Search
const searchForm = document.querySelector(".search-form"),
  searchInput = document.querySelector(".search-form__input");

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  const searchText = searchInput.value;
  if (searchText) {
    window.location.href = `https://www.google.com/search?q=${searchText}`;
  }
});
