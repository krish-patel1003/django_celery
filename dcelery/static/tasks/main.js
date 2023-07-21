document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", () => {
    fetch("/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: button.dataset.type }),
    })
      .then((response) => response.json())
      .then((res) => {
        getStatus(res.task_id);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

function getStatus(taskID) {
  fetch(`/tasks/${taskID}/`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) => {
      const html = `
        <tr>
          <td>${res.task_id}</td>
          <td>${res.task_status}</td>
          <td>${res.task_result}</td>
        </tr>`;
      document.querySelector("#tasks").insertAdjacentHTML("afterbegin", html);

      const taskStatus = res.task_status;
      if (taskStatus === "SUCCESS" || taskStatus === "FAILURE") return false;
      setTimeout(function () {
        getStatus(res.task_id);
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
    });
}
    