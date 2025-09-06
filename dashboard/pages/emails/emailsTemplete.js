// emailsTemplate.js
export const emailsTemplate = `
  <h3>Messages</h3>

  <!-- Search Filters -->
  <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-3">
    <div class="input-group w-auto ">
      <span class="input-group-text bg-light border-end-0">
        <i class="fa fa-hashtag"></i>
      </span>
      <input type="text" class="form-control border-start-0 custom-input" id="emailSearchById" placeholder="🔎 Search by ID" />
    </div>

    <div class="input-group w-auto">
      <span class="input-group-text bg-light border-end-0">
        <i class="fa fa-user"></i>
      </span>
      <input type="text" class="form-control border-start-0 custom-input" id="emailSearchByName" placeholder="🔎 Search by Name" />
    </div>

    <div class="input-group bg-light w-auto">
      <span class="input-group-text bg-light border-end-0">
        <i class="fa fa-envelope"></i>
      </span>
      <input type="text" class="form-control border-start-0 custom-input" id="emailSearchByEmail" placeholder="🔎 Search by Email" />
    </div>

  <!-- Messages Table -->
  <div class="table-responsive">
    <table class="table table-striped table-bordered align-middle text-center p-2">
      <thead class="Thead">
        <tr>
          <th>#</th>
          <th>Sender</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Subject</th>
          <th>Message</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="emailsTable"></tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div class="d-flex justify-content-between align-items-center mt-2 w-100">
    <button id="emailPrevPage" class="btn btn-outline-secondary btn-sm">Previous</button>
    <span id="emailPageInfo"></span>
    <button id="emailNextPage" class="btn btn-outline-secondary btn-sm">Next</button>
  </div>

  <!-- Reply Modal -->
  <div class="modal fade" id="emailModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Reply to Message</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="respTo" class="form-label">To</label>
            <input type="text" class="form-control" id="respTo" readonly />
          </div>
          <div class="mb-3">
            <label for="respSubject" class="form-label">Subject</label>
            <input type="text" class="form-control" id="respSubject" />
          </div>
          <div class="mb-3">
            <label for="respMessage" class="form-label">Message</label>
            <textarea class="form-control" id="respMessage" rows="4"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn reply-btn" id="sendRespBtn">Send Response</button>
        </div>
      </div>
    </div>
  </div>
`;
