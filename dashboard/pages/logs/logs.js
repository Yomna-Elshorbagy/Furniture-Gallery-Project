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

  // ===> Export CSV <===
  document.getElementById("exportCsv").addEventListener("click", () => {
    if (!logs.length)
      return Swal.fire("No Logs", "There are no logs to export.", "info");

    let csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Action,Entity Type,Entity ID,Entity Name,Admin,Timestamp"]
        .concat(
          logs.map(
            (l) =>
              `${l.id},"${l.action}",${l.entityType},${l.entityId},"${l.entityName}",${l.admin},"${l.timestamp}"`
          )
        )
        .join("\n");

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // ===> Export PDF <===
  document.getElementById("exportPdf").addEventListener("click", () => {
    if (!logs.length)
      return Swal.fire("No Logs", "There are no logs to export.", "info");

    let printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Logs Report</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ccc; font-size: 12px; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <h2>📊 Admin Logs Report</h2>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Entity ID</th>
                <th>Entity Name</th>
                <th>Admin</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${logs
                .map(
                  (l) => `
                <tr>
                  <td>${l.id}</td>
                  <td>${l.action}</td>
                  <td>${l.entityType}</td>
                  <td>${l.entityId}</td>
                  <td>${l.entityName}</td>
                  <td>${l.admin}</td>
                  <td>${l.timestamp}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
