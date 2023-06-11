// popup.js

// "default_popup": "popup.html",
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("task-form");
  var input = document.getElementById("task-input");
  var taskList = document.getElementById("task-list");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var task = input.value.trim();
    if (task !== "") {
      addTask(task);
      input.value = "";
    }
  });

  taskList.addEventListener("click", function (e) {
    var target = e.target;
    if (target.classList.contains("delete-button")) {
      var taskItem = target.parentNode;
      var task = taskItem.getAttribute("data-task");
      deleteTask(task);
    } else if (target.classList.contains("checkbox")) {
      var taskItem = target.parentNode;
      var task = taskItem.getElementsByClassName("task-name")[0];
      toggleTaskCompletion(task);
    }
  });

  function addTask(task) {
    chrome.storage.sync.get("tasks", function (result) {
      var tasks = result.tasks;
      tasks.push({ task: task, completed: false });
      chrome.storage.sync.set({ tasks: tasks }, function () {
        renderTasks();
      });
    });
  }

  function deleteTask(task) {
    chrome.storage.sync.get("tasks", function (result) {
      var tasks = result.tasks;
      var index = tasks.findIndex(function (t) {
        return t.task === task;
      });
      if (index !== -1) {
        tasks.splice(index, 1);
        chrome.storage.sync.set({ tasks: tasks }, function () {
          renderTasks();
        });
      }
    });
  }

  function toggleTaskCompletion(taskName) {
    chrome.storage.sync.get("tasks", function (result) {
      var tasks = result.tasks;
      var index = tasks.findIndex(function (t) {
        return t.task === taskName.textContent;
      });
      if (index !== -1) {
        tasks[index].completed = !tasks[index].completed;
        chrome.storage.sync.set({ tasks: tasks }, function () {
          renderTasks();
        });
      }
    });
  }

  function renderTasks() {
    taskList.innerHTML = "";
    chrome.storage.sync.get("tasks", function (result) {
      var tasks = result.tasks;
      for (var i = 0; i < tasks.length; i++) {
        var taskItem = document.createElement("li");
        var taskData = tasks[i];

        taskItem.classList.add("task-item");
        taskItem.setAttribute("data-task", taskData.task);

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");
        checkbox.checked = taskData.completed;

        var taskName = document.createElement("span");
        taskName.classList.add("task-name");
        taskName.textContent = taskData.task;

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "";
        deleteButton.classList.add("delete-button");

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskName);
        taskItem.appendChild(deleteButton);

        if (taskData.completed) {
          taskItem.classList.add("completed");
        }

        taskList.appendChild(taskItem);
      }
    });
  }

  renderTasks();
});
