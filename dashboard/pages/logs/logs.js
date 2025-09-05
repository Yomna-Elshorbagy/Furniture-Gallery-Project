export function initLogsPage() {
  let logs = JSON.parse(localStorage.getItem("logs")) || [];
  let logsTable = document.getElementById("logsTable");

  logsTable.innerHTML = "";
  logs.forEach((log) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.id}</td>
      <td><span class="badge bg-info">${log.action}</span></td>
      <td>${log.entityType}</td>
      <td>${log.entityId}</td>
      <td>${log.entityName}</td>
      <td>${log.admin}</td>
      <td>${log.timestamp}</td>
    `;
    logsTable.appendChild(row);
  });

  document.getElementById("clearLogs").addEventListener("click", () => {
    Swal.fire({
      title: "Clear Logs?",
      text: "This will remove all logs permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("logs");
        initLogsPage();
      }
    });
  });
}

// logs function
export function addLog(action, entity, entityType = "Unknown") {
  let logs = JSON.parse(localStorage.getItem("logs")) || [];
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    Name: "System",
  };

  const logEntry = {
    id: logs.length ? Math.max(...logs.map((l) => l.id)) + 1 : 1,
    action,
    entityType,
    entityId: entity.id,
    entityName: entity.name || entity.title || entity.companyName || "-",
    admin: loggedInUser.Name,
    timestamp: new Date().toLocaleString(),
  };

  logs.push(logEntry);
  localStorage.setItem("logs", JSON.stringify(logs));
}
