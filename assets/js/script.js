// seleção elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// funcoes
const saveTodo = (text, done = 0, save = 1) => {
    const todo =document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    //utilizando dados da localStorage
    if(done) {
        todo.classList.add("done");
    }

    if(save) {
        saveTodoLocalStorage({text, done: 0});
    }

    todoList.appendChild(todo);

    //Para quando enviar ficar vazio e focar nele

    todoInput.value = "";
}

    //O toggle serve para fazer a troca entre remover e add a class

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

    // Atualiza a edição fazendo um novo array com forEach

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;

            // Utilizando dados da localStorage
            updateTodoLocalStorage(oldInputValue, text);
        }
    });
};

const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3").innerText.toLocaleLowerCase();

        todo.style.display = "flex";

        console.log(todoTitle);

        if(!todoTitle.includes(search)) {
            todo.style.display = "none";
        }
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch(filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));
            break;

        case "done":
            todos.forEach((todo) => todo.classList.contains("done") 
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
            );
            break;

        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done") 
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
            );
            break;

            default:
            break;
}
};

// eventos

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue) {
        saveTodo(inputValue);

    }
});

document.addEventListener("click", (e) => {

    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText || "";
    }

    if(targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove();

        // Utilizando dados da localStorage
        removeTodoLocalStorage(todoTitle);
    }

    if(targetEl.classList.contains("edit-todo")){
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue) {
        //atualiza
        updateTodo(editInputValue);
    }
    toggleForms();
});

 //keyup é um evento que acontece sempre que a pessoa solta a tecla

searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value;

    getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    //para o keyup ser apagado e toda lista voltar ao clicar nesse botao
    //dispatchEvent (disparando um evento naquele input)

    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
});

//local storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
      });
};

const saveTodoLocalStorage = (todo) => {
    //todos os todos da ls, get para pegar
    const todos = getTodosLocalStorage();

    //add o novo todo no arr
    todos.push(todo);

    //salvar tudo na ls, set para mudar ou salvar
    localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    // map não retorna dados ele modifica os dados originais
  
    todos.map((todo) =>
      todo.text === todoText ? (todo.done = !todo.done) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoOldText ? (todo.text = todoNewText) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };

loadTodos();