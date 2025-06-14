

// 🔹 Select Input, Button, and Task List Elements  
let inp = document.querySelector("#taskInput");
let btn = document.querySelector("#addTaskBtn");
let ul = document.querySelector("#taskList");

//  Add a New Task When Button is Clicked
btn.addEventListener("click", function() {
    if (inp.value.trim() === "") return; //  Prevent empty tasks from being added

    let item = document.createElement("li"); // Create a new task item (li)
    item.innerText = inp.value; //  Set task text
    item.dataset.status = "pending"; // Default status for new tasks
    item.draggable = true; //  Make draggable immediately

    //  Attach Drag-and-Drop Event Listeners
    item.addEventListener("dragstart", function(event) {
        event.target.classList.add("dragging"); //  Highlight the task when dragging starts
    });

    item.addEventListener("dragend", function(event) {
        event.target.classList.remove("dragging"); //  Remove highlight after dropping
        saveTasks(); //  Save updated order in localStorage
    });

    //  Add Checkbox for Completion Tracking
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // 🔹 Create Delete Button
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.classList.add("Delete"); //  Add class for easy selection

    //  Append Elements to Task List Item
    item.appendChild(checkbox);
    item.appendChild(delBtn);
    ul.appendChild(item);
    inp.value = ""; //  Reset input field after adding task

    saveTasks(); //  Save tasks in localStorage
});

// 🗑 Delete a Task When "Delete" Button is Clicked
ul.addEventListener("click", function(event) {
    if (event.target.classList.contains("Delete")) {
        event.target.parentElement.remove(); //  Remove the task from UI
        saveTasks(); //  Update localStorage after deletion
    }
});

// Update Task Status When Checkbox is Clicked
ul.addEventListener("change", function(event) {
    if (event.target.type === "checkbox") {
        let listItem = event.target.parentElement;
        listItem.dataset.status = event.target.checked ? "completed" : "pending"; //  Toggle status
        saveTasks(); //  Save updated status in localStorage
    }
});

//  Task Filtering Logic: Show Only "All", "Completed", or "Pending" Tasks
document.querySelector(".filters").addEventListener("click", function(event) {
    if (event.target.classList.contains("filter")) {
        document.querySelectorAll(".filter").forEach(button => button.classList.remove("active")); //  Remove "active" class
        event.target.classList.add("active"); //  Set "active" on clicked button

        let filterType = event.target.getAttribute("data-filter"); // 🔹 Get filter type
        document.querySelectorAll("#taskList li").forEach(listItem => {
            listItem.style.display = (filterType === "all" || listItem.dataset.status === filterType) ? "flex" : "none"; //  Show matching tasks
        });
    }
});

// 🔹 Save Tasks to localStorage for Persistence
function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(listItem => {
        tasks.push({
            text: listItem.firstChild.textContent.trim(), //  Save task text
            status: listItem.dataset.status, //  Save status ("completed" or "pending")
            checked: listItem.querySelector("input").checked //  Save checkbox state
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks)); //  Store tasks in localStorage
}

// 🛠 Load Stored Tasks from localStorage on Page Load
document.addEventListener("DOMContentLoaded", loadTasks);
function loadTasks() {
    let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(task => {
        let item = document.createElement("li");
        item.innerText = task.text;
        item.dataset.status = task.status;

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.checked;

        let delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.classList.add("Delete");

        item.appendChild(checkbox);
        item.appendChild(delBtn);
        ul.appendChild(item);
    });
}

// 🔹 Apply Dark Mode Based on User Preference
let toggleBtn = document.querySelector("#toggleMode");
let body = document.body;

// 🔹 Load saved dark mode preference on page load
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
}

// 🔹 Toggle Dark Mode on Button Click
toggleBtn.addEventListener("click", function() {
    body.classList.toggle("dark-mode");

    //  Save dark mode preference to localStorage
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
});

//  Enable Drag-and-Drop Reordering for Tasks
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#taskList li").forEach(item => {
        item.draggable = true; //  Make tasks draggable

        item.addEventListener("dragstart", function(event) {
            event.target.classList.add("dragging"); //  Highlight item while dragging
        });

        item.addEventListener("dragend", function(event) {
            event.target.classList.remove("dragging"); //  Remove highlight
            saveTasks(); //  Save updated order
        });
    });
});

// 🔹 Handle Task Positioning During Dragging
ul.addEventListener("dragover", function(event) {
    event.preventDefault(); //  Allow dropping in new position

    const draggingItem = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(ul, event.clientY);
    if (afterElement == null) {
        ul.appendChild(draggingItem); //  Move to end if no task below
    } else {
        ul.insertBefore(draggingItem, afterElement); //  Place in correct position
    }
});

// 🔹 Helper Function to Determine Drop Position
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 🔥 "Clear All Tasks" Button to Reset Task List
let clearBtn = document.querySelector("#clearTasks");
clearBtn.addEventListener("click", function() {
    ul.innerHTML = ""; //  Clears all tasks from UI
    localStorage.removeItem("tasks"); // Clears tasks from localStorage
});