// Bookmarks

const bookmarksGrid = new Muuri(".bookmarks__list");
const bookmarksArray = JSON.parse(localStorage.getItem("bookmarksList")) || [];

const bookmarksAddBtn = document.querySelector(".bookmarks__btn--add"),
  bookmarksList = document.querySelector(".bookmarks__list"),
  modalOverlay = document.querySelector(".modal-overlay"),
  bookmarksForm = document.querySelector(".bookmarks__form"),
  bookmarksFormName = document.querySelector(".bookmarks__form-input--name"),
  bookmarksFormLink = document.querySelector(".bookmarks__form-input--link"),
  bookmarksFormCloseBtn = document.querySelector(".bookmarks__form-close");

// Вывод закладок если они есть в localStorage
const displayBookmarkFromLocalStorage = function () {
  bookmarksArray.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("bookmarks__bookmark");
    li.setAttribute("data-bookmark-id", item.bookmarkId);

    if (item.bookmarkTypeIcon === "favicon") {
      const bookmarkItem = `
                <div class="bookmarks__bookmark-content">
                  <a
                    href="${item.bookmarkLink}"
                    
                    class="bookmarks__bookmark-link"
                  >
                    <img
                      class="bookmarks__bookmark-icon"
                      src="https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.bookmarkLink}&size=64"
                    />
                    <span class="bookmarks__bookmark-name">${item.bookmarkName}</span>
                  </a>
               <button
                  class="bookmarks__bookmark-btn bookmarks__bookmark-btn--delete"
                >
                  <img
                    class="bookmarks__bookmark-btn-icon"
                    src="img/todo-delete-icon.svg"
                    alt="-"
                  />
                </button>
                </div>
    `;

      li.innerHTML = bookmarkItem;
      bookmarksGrid.add(li);
    } else {
      const bookmarkItem = `
                <div class="bookmarks__bookmark-content">
                  <a
                    href="${item.bookmarkLink}"
                    
                    class="bookmarks__bookmark-link"
                  >
                   <span class='bookmarks__bookmark-letter'>${item.bookmarkName[0].toUpperCase()}</span>
                    <span class="bookmarks__bookmark-name">${
                      item.bookmarkName
                    }</span>
                  </a>
                <button
                  class="bookmarks__bookmark-btn bookmarks__bookmark-btn--delete"
                >
                  <img
                    class="bookmarks__bookmark-btn-icon"
                    src="img/todo-delete-icon.svg"
                    alt="-"
                  />
                </button>
                </div>
          `;

      li.innerHTML = bookmarkItem;
      bookmarksGrid.add(li);
    }
  });
};
displayBookmarkFromLocalStorage();

// Добавление закладки в HTML и сохранение в localStorage
bookmarksForm.addEventListener("submit", e => {
  e.preventDefault();

  const bookmarkName = bookmarksFormName.value;
  const bookmarkLink =
    bookmarksFormLink.value.includes("https://") ||
    bookmarksFormLink.value.includes("http://")
      ? bookmarksFormLink.value
      : "https://" + bookmarksFormLink.value; // Есть ли в строке https или http протокол в случае если нет добавляется

  // Вывод самой закладки
  function outputBookmark(bookmarkItem, bookmarkItemInfoType) {
    // Закрытие формы после успешного добавления
    bookmarksForm.classList.remove("bookmarks__form--open");
    modalOverlay.classList.remove("modal-overlay--open");

    // Очистка инпутов
    bookmarksFormName.value = "";
    bookmarksFormLink.value = "";

    // Сохранение в localStorage
    const bookmarkItemInfo = {
      bookmarkName: bookmarkName,
      bookmarkLink: bookmarkLink,
      bookmarkTypeIcon: bookmarkItemInfoType, // favicon or letter
      bookmarkId: Math.floor(Math.random() * (1000000 - 10)) + 10,
    };
    // Создание элемента и вывод его в html сетку
    const li = document.createElement("li");
    li.classList.add("bookmarks__bookmark");
    li.innerHTML = bookmarkItem;
    li.setAttribute("data-bookmark-id", bookmarkItemInfo.bookmarkId);
    bookmarksGrid.add(li);

    bookmarksArray.push(bookmarkItemInfo);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarksArray));
  }

  // Таймер проверки ссылки(если fetch длится больше 1сек, тогда эта ссылка не валидна)
  const timeoutPromise = function (seconds) {
    return new Promise(function (_, reject) {
      setTimeout(() => {
        reject("test");
      }, seconds * 1000);
    });
  };
  if (bookmarkName && bookmarkLink.length > 8) {
    /* В случае если ссылка существует иконкой будет 
      Favicon приложения в ином случае первая буква name
    */
    // Если запрос больше секунды тогда это не валидная ссылка
    try {
      Promise.race([
        fetch(bookmarkLink, {
          mode: "no-cors",
        }),
        timeoutPromise(1.5),
      ]).then(
        // В случае успеха(если fetch загрузился быстрее timeoutPromise(1сек))
        e => {
          const bookmarkItem = `
                <div class="bookmarks__bookmark-content">
                  <a
                    href="${bookmarkLink}"
                    
                    class="bookmarks__bookmark-link"
                  >
                    <img
                      class="bookmarks__bookmark-icon"
                      src="https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${bookmarkLink}&size=64"
                    />
                    <span class="bookmarks__bookmark-name">${bookmarkName}</span>
                  </a>
                 <button
                  class="bookmarks__bookmark-btn bookmarks__bookmark-btn--delete"
                >
                  <img
                    class="bookmarks__bookmark-btn-icon"
                    src="img/todo-delete-icon.svg"
                    alt="-"
                  />
                </button>
                </div>
    `;

          outputBookmark(bookmarkItem, "favicon");
        },
        e => {
          // В случае провала(если ссылки нет значит не получится установить favicon)
          // Устанавливается иконкой первая буква
          const bookmarkItem = `
                <div class="bookmarks__bookmark-content">
                  <a
                    href="${bookmarkLink}"
                    
                    class="bookmarks__bookmark-link"
                  >
                   <span class='bookmarks__bookmark-letter'>${bookmarkName[0].toUpperCase()}</span>
                    <span class="bookmarks__bookmark-name">${bookmarkName}</span>
                  </a>
                 <button
                  class="bookmarks__bookmark-btn bookmarks__bookmark-btn--delete"
                >
                  <img
                    class="bookmarks__bookmark-btn-icon"
                    src="img/todo-delete-icon.svg"
                    alt="-"
                  />
                </button>
                </div>
          `;

          outputBookmark(bookmarkItem, "letter");
        }
      );
    } catch (e) {
      console.log(e, "Favicon not found");
    }
  }
});

// Удаление закладки
bookmarksList.addEventListener("click", e => {
  const item = e.target.closest(".bookmarks__bookmark");
  if (!item) return;

  const itemId = bookmarksArray.findIndex(
    bookmark => bookmark.bookmarkId === +item.dataset.bookmarkId
  );

  const deleteBtn = e.target.closest(".bookmarks__bookmark-btn--delete");
  if (deleteBtn) {
    bookmarksGrid.remove(bookmarksGrid.getItems(itemId), {
      removeElements: true,
    });
    bookmarksArray.splice(itemId, 1);
    localStorage.setItem("bookmarksList", JSON.stringify(bookmarksArray));
  }
});

// Modal Window
modalOverlay.addEventListener("click", e => {
  bookmarksForm.classList.remove("bookmarks__form--open");
  modalOverlay.classList.remove("modal-overlay--open");
});
// Открытие формы добавления закладки
bookmarksAddBtn.addEventListener("click", e => {
  bookmarksForm.classList.add("bookmarks__form--open");
  modalOverlay.classList.add("modal-overlay--open");
});
// Закрытие формы закладок
bookmarksFormCloseBtn.addEventListener("click", e => {
  bookmarksForm.classList.remove("bookmarks__form--open");
  modalOverlay.classList.remove("modal-overlay--open");
});
