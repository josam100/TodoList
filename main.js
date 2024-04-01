const tasksContainer = document.getElementById("tasksContainer");

function updateLineWidth() {
  const checkboxCount = document.querySelectorAll(
    '.task input[type="checkbox"]'
  ).length;
  const lineWidth = checkboxCount > 0 ? `${100 / checkboxCount}%` : "0%";
  document.documentElement.style.setProperty("--lineWidth", lineWidth);
}

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let tasksContainer = document.getElementById("tasksContainer");
  let firstCharacter = taskInput.value.charAt(1);
  let numberOfTasks = tasksContainer.children.length;
  let newId = firstCharacter + numberOfTasks;

  if (taskInput.value.trim() !== "") {
    let taskData = {
      id: newId,
      label: taskInput.value,
    };

    saveTaskToLocalStorage(taskData);

    tasksContainer.innerHTML += `
            <div class="task">
                <div class="leftSide">
                    <input type="checkbox" id="${taskData.id}" onchange="handleCheckboxChange(this)" />
                    <label for="${taskData.id}" id="taskLabel">${taskData.label}</label>
                </div>

                <div class="rightSide">
                    <button type="submit" onclick="update(this)">✒️</button>
                    <button type="submit" onclick="remove(this)">🗑</button>
                </div>
            </div>
        `;
  } else {
    console.log("لم يتم تقديم مهمة");
  }
  taskInput.value = "";
  updateLineWidth();
  updateLocalStorage();
}

function saveTaskToLocalStorage(taskData) {
  let tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
  tasksData.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function restoreTasksFromLocalStorage() {
  let tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
  let tasks = document.getElementById("tasksContainer");

  tasks.innerHTML = "";

  tasksData.forEach(function (taskData) {
    tasks.innerHTML += `
            <div class="task">
                <div class="leftSide">
                    <input type="checkbox" id="${taskData.id}" onchange="handleCheckboxChange(this)" />
                    <label for="${taskData.id}" id="taskLabel">${taskData.label}</label>
                </div>

                <div class="rightSide">
                    <button type="submit" onclick="update(this)">✒️</button>
                    <button type="submit" onclick="remove(this)">🗑</button>
                </div>
            </div>
        `;
  });
}

function updateLocalStorage() {
  let tasksData = Array.from(
    document.getElementById("tasksContainer").children
  ).map(function (taskElement) {
    let id = taskElement.querySelector('input[type="checkbox"]').id;
    let label = taskElement.querySelector("label").textContent;
    return { id, label };
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function handleCheckboxChange(checkbox) {
  if (checkbox.checked) {
    addAchievementsLine();
  } else {
    removeAchievementsLine();
  }
  updateLocalStorage();
}

function addAchievementsLine() {
  let achievementsLine = document.querySelector(".achievementsLine");

  if (achievementsLine) {
    achievementsLine.innerHTML += '<div class="line"></div>';
  }
  updateLocalStorage();
}

function removeAchievementsLine() {
  let achievementsLine = document.querySelector(".achievementsLine");

  if (achievementsLine) {
    let lines = achievementsLine.querySelectorAll(".line");
    if (lines.length > 0) {
      lines[lines.length - 1].remove();
    }
  }
  updateLocalStorage();
}

function update(element) {
  let taskInput = document.getElementById("taskInput");
  let taskLabel =
    element.parentNode.previousElementSibling.querySelector("#taskLabel");

  taskInput.value = taskLabel.textContent;

  element.parentNode.parentNode.remove();
  updateLocalStorage();
}

function remove(element) {
  let checkbox = element.parentNode.parentNode.querySelector(
    'input[type="checkbox"]'
  );

  if (checkbox && checkbox.checked) {
    removeAchievementsLine();
  }

  element.parentNode.parentNode.remove();
  updateLocalStorage();
}

document.addEventListener("DOMContentLoaded", function () {
  restoreTasksFromLocalStorage();
});
