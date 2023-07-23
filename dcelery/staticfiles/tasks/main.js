// JavaScript
document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", () => {
    performTask(button.dataset.type);
  });
});

function performTask(taskType) {
  fetch("/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: taskType }),
  })
    .then((response) => response.json())
    .then((res) => {
      // Start checking status for the task
      checkStatus(res.task_id);
    })
    .catch((err) => {
      console.log(err);
    });
}

function checkStatus(taskID) {
  fetch(`/tasks/${taskID}/`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) => {
      const taskStatus = res.task_status;
      const html = `
        <tr>
          <td>${res.task_id}</td>
          <td>${res.task_status}</td>
          <td>${res.task_result}</td>
        </tr>`;
      document.querySelector("#tasks").insertAdjacentHTML("afterbegin", html);

      if (taskStatus === "SUCCESS" || taskStatus === "FAILURE") return;
      setTimeout(function () {
        checkStatus(res.task_id);
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
    });
}
