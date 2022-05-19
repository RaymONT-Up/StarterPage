// Todo
const todoCreateForm = document.querySelector(".todo__create"),
  todoCreateTextarea = document.querySelector(".todo__create-textarea"),
  todoCreateBtn = document.querySelector(".todo__create-button"),
  todoList = document.querySelector(".todo__list"),
  todoOpenBtn = document.querySelector(".todo__btn--burger"),
  todoCloseBtn = document.querySelector(".todo__btn--close"),
  todoMainWrapper = document.querySelector(".todo");
const todos = JSON.parse(localStorage.getItem("todos")) || [];

// Вывод задач из localStorage
const outputLocalTodos = function (todos) {
  todos.forEach(item => {
    const todoTask = `
       <li class="todo__item ${item.todoValue}" data-todo-id='${
      item.todoId
    }'>    
              <div class="todo__item-text" spellcheck="false" '>${item.todoText.trim()}</div>
              <div class="todo__item-setting-container">
                <button
                  class="todo__item-btn--settings todo__item-btn--current"
                >
                  <img
                    class="todo__item-btn--current-img"
                    src="img/todo-settings-icon.svg"
                    alt="?"
                  />
                </button>

                <!------>
                <button
                  class="todo__item-btn--not-done todo__item-btn--setting"
                >
                  <img src="img/todo-not-done-icon.svg" alt="-" />
                </button>
                <button class="todo__item-btn--done todo__item-btn--setting">
                  <img src="img/todo-done-icon.svg" alt="+" />
                </button>
                <button class="todo__item-btn--edit todo__item-btn--setting">
                  <img src="img/todo-edit-icon.svg" alt="+" />
                </button>
                <button class="todo__item-btn--delete todo__item-btn--setting">
                  <img src="img/todo-delete-icon.svg" alt="+" />
                </button>
              </div>
            </li>
  `;
    todoList.insertAdjacentHTML("beforeend", todoTask);
  });
};
outputLocalTodos(todos);
// Создание новой задачи
const todoCreateNewTask = function () {
  if (todoCreateTextarea.value.length > 1) {
    // Сохранение в localStorage
    const todoInfo = {
      todoText: todoCreateTextarea.value.trim(),
      todoValue: "", // todo__item--done - выполнено, todo__item--not-done - не выполнено
      todoId: Math.floor(Math.random() * (1000000 - 10)) + 10,
    };
    todos.push(todoInfo);
    localStorage.setItem("todos", JSON.stringify(todos));

    const todoTask = `
       <li class="todo__item" data-todo-id='${todoInfo.todoId}'>    
              <div class="todo__item-text" spellcheck="false" > ${todoCreateTextarea.value.trim()}</div>
              <div class="todo__item-setting-container">
                <button
                  class="todo__item-btn--settings todo__item-btn--current"
                >
                  <img
                    class="todo__item-btn--current-img"
                    src="img/todo-settings-icon.svg"
                    alt="?"
                  />
                </button>

                <!------>
                <button
                  class="todo__item-btn--not-done todo__item-btn--setting"
                >
                  <img src="img/todo-not-done-icon.svg" alt="-" />
                </button>
                <button class="todo__item-btn--done todo__item-btn--setting">
                  <img src="img/todo-done-icon.svg" alt="+" />
                </button>
                <button class="todo__item-btn--edit todo__item-btn--setting">
                  <img src="img/todo-edit-icon.svg" alt="+" />
                </button>
                <button class="todo__item-btn--delete todo__item-btn--setting">
                  <img src="img/todo-delete-icon.svg" alt="+" />
                </button>
              </div>
            </li>
  `;

    todoList.insertAdjacentHTML("beforeend", todoTask);
    todoCreateTextarea.style.height = 60 + "px";
    todoCreateTextarea.value = "";
  }
};
// Изменение высоты textarea при написании текста
const resizeTextarea = function (e) {
  if (e.code !== "Enter") {
    setTimeout(() => {
      this.style.cssText = "height: auto;";
      this.style.cssText = "height:" + this.scrollHeight + "px";
    }, 100);
  } else {
    // Убирается перенос на новую строку при нажатие enter
    // Создается новая задача
    e.preventDefault();
    todoCreateNewTask();
  }
};

//// Обработчики событий
todoCreateTextarea.addEventListener("keydown", resizeTextarea);
todoCreateBtn.addEventListener("click", todoCreateNewTask);

todoList.addEventListener("click", function (e) {
  const item = e.target.closest(".todo__item");

  const settingBtn = e.target.closest(".todo__item-btn--settings");
  const doneBtn = e.target.closest(".todo__item-btn--done");
  const notDoneBtn = e.target.closest(".todo__item-btn--not-done");
  const deleteBtn = e.target.closest(".todo__item-btn--delete");
  const editBtn = e.target.closest(".todo__item-btn--edit");
  const btns = e.target.closest(".todo__item-btn--setting");

  if (!item) return;
  const itemText = item.firstElementChild;
  const itemId = todos.findIndex(todo => todo.todoId === +item.dataset.todoId);

  if (settingBtn) {
    item.classList.toggle("todo__item--active-settings");
  }
  if (btns) {
    item.classList.remove("todo__item--active-settings");
  }
  if (doneBtn) {
    item.classList.remove("todo__item--not-done");
    item.classList.toggle("todo__item--done");
    itemText.removeAttribute("contenteditable");

    if (todos[itemId].todoValue !== "todo__item--done") {
      todos[itemId].todoValue = "todo__item--done";
      localStorage.setItem("todos", JSON.stringify(todos));
    } else {
      todos[itemId].todoValue = "";
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }

  if (notDoneBtn) {
    item.classList.remove("todo__item--done");
    item.classList.toggle("todo__item--not-done");
    itemText.removeAttribute("contenteditable");

    // Сохранение информации в localStorage

    if (todos[itemId].todoValue !== "todo__item--not-done") {
      todos[itemId].todoValue = "todo__item--not-done";
      localStorage.setItem("todos", JSON.stringify(todos));
    } else {
      todos[itemId].todoValue = "";
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }

  if (deleteBtn) {
    // Удаление из localStorage
    todos.splice(itemId, 1);
    localStorage.setItem("todos", JSON.stringify(todos));

    item.remove();
  }

  if (editBtn) {
    itemText.toggleAttribute("contenteditable");
    if (!itemText.getAttribute("contenteditable")) {
      // Редактирование в localStorage
      todos[itemId].todoText = itemText.textContent;
      localStorage.setItem("todos", JSON.stringify(todos));
    }
    itemText.addEventListener("keydown", e => {
      if (e.code === "Enter") {
        e.preventDefault();
        itemText.removeAttribute("contenteditable");

        // Редактирование в localStorage
        todos[itemId].todoText = itemText.textContent;
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  }
});

// Todo Burger для телефонов
todoOpenBtn.addEventListener("click", e => {
  todoMainWrapper.classList.toggle("todo--open");
  weatherMainWrapper.classList.remove("weather--open");
});
todoCloseBtn.addEventListener("click", e => {
  todoMainWrapper.classList.remove("todo--open");
});
