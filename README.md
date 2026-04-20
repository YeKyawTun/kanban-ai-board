# Kanban board with AI-assisted Assignee Recommendation

A Kanban board with AI-assisted assignee recommendation:
- 4 columns: To Do, In Progress, Review, Done
- create, edit, move, delete, archive tickets
- hybrid assignee recommendation: backend computes the recommendation deterministically, AI is used for explanation
- JSON file persistence
- Dockerized app

==========================================================================


## AI Tool Usage
ChatGPT

==========================================================================

## Tech stack
- HTML, CSS, JavaScript
- Node.js + Express
- JSON file storage
- OpenAI API
- Curl for API testing
- Jest for TicketService

==========================================================================

## Why JSON storage
This version intentionally uses JSON files instead of a database to keep infrastructure small and reliable while preserving clean architecture boundaries.

==========================================================================

## Environment file variable under app for PORT, AI Usage, and OPENAI API KEY

`.env` and `.env.example` located under `app` folder

PORT=3000
AI_ENABLED=true
OPENAI_API_KEY=

==========================================================================


## Run locally with Docker
1. Copy `app/.env.example` to `app/.env`
2. Update `AI_ENABLED=false` to `AI_ENABLED=true`
3. Paste `OPENAI_API_KEY=`
4. Start the app:

```bash
 docker compose up --build
```

5. Open:

```text
http://localhost:3000
```
==========================================================================

## Project Structure
app/src/
├── app.js
├── server.js
├── config/
├── controllers/
├── data/
├── domain/
├── infrastructure/
│   ├── ai/
│   └── storage/
├── middleware/
├── public/
│   ├── js/
│   └── styles/
├── repositories/
├── routes/
├── services/
└── utils/

==========================================================================
## Board Features

- Four workflow columns:
  - To Do
  - In Progress
  - Review
  - Done
- Visual Kanban-style layout for tracking task progress
- Column-based movement using left/right controls
- Automatic refresh of board state after create, edit, move, delete, and archive actions
- Completed tickets in the Done column are visually marked with a strikethrough title. 
  Alos, it change to `"archived": true` from `"archived": false`
- Archived Done tickets are removed from the active board view. 
  But, maintain in JSON record with `"archived": true`.
- Persistent board state using JSON file storage

==========================================================================

## Card Features

Each card represents one task and includes:

- Title
- Description
- Status
- Priority
- Label
- Assignee
- Due date

Supported card actions:

- Create new card
- Edit existing card
- Move card to the previous column
- Move card to the next column
- Delete card
- Archive completed card from the Done column

Additional card behavior:

- Cards in **To Do** do not show a left arrow
- Cards in **Done** do not show a right arrow
- Cards created through recommendation flow are added directly into **To Do** when user click
  `Use recommended assignee`

==========================================================================


## AI feature: Assignee Recommendation Support
The AI-related feature in this project is **assignee recommendation support**.

The recommendation flow is:

1. The backend calculates a recommendation using deterministic logic.
2. If AI is enabled, OpenAI is used to generate a human-readable explanation.
3. If AI is disabled or unavailable, a fallback explanation is returned.

This keeps the recommendation logic explainable and testable while still allowing an AI-assisted user experience.




## AI-Assisted Assignee Recommendation Feature

The application includes an AI-assisted assignee recommendation feature to support task assignment during ticket creation.

### What it does

When a user enters ticket details and requests a recommendation, the backend evaluates available team members and suggests:

- a **recommended assignee**
- an **alternate assignee** when applicable
- a short **explanation** describing the recommendation

### How it works

The recommendation decision is calculated in the backend using deterministic logic based on:

- ticket label
- assignee specialization match
- completed history for similar tickets
- current workload across:
  - To Do
  - In Progress
  - Review

The explanation layer is AI-assisted when enabled.

### Recommendation flow

1. User fills in ticket details.
2. User clicks **Recommend Assignee**.
3. Backend calculates the best candidate and an alternate candidate.
4. If AI is enabled, OpenAI generates a natural-language explanation.
5. If AI is unavailable or disabled, a fallback explanation is generated locally.
6. User can accept the recommendation by clicking **Use Recommended Assignee**.
7. The ticket is then created directly in the **To Do** column.

## Recommendation Logic

The backend recommendation logic currently uses:

- specialization match against the selected label
- historical completed tickets for the same label
- weighted current workload:
  - To Do
  - In Progress
  - Review

The current scoring formula is:

```text
totalScore = historyScore + specializationBonus - workloadPenalty

historyScore = completed similar tickets
specializationBonus = extra score if specialization matches the label
workloadPenalty = weighted penalty based on current assigned tickets by status
```

### Why it is AI-assisted

The recommendation ranking itself is rule-based and explainable.  
AI is used to enhance the user experience by generating a human-readable explanation of the recommendation when available.

### Output shown to the user

The recommendation panel displays:

- Recommended assignee
- Alternate assignee
- Explanation
- Explanation source (`OpenAI` or `fallback`)

==========================================================================

## Main API endpoints

- `GET /api/tickets`
- `GET /api/team-members`
- `POST /api/tickets`
- `PUT /api/tickets/:id`
- `PATCH /api/tickets/:id/status`
- `DELETE /api/tickets/:id`
- `PATCH /api/tickets/1/archive`
- `POST /api/recommendations/assignee`


***Note***
API test results are documented in `API Test.docx` under /kanban-ai-board-json/docs.

==========================================================================

## JEST Testing for TicketService
Unit Test for Ticket Object Creation

This test check newly created ticket has “archived value” which is default by “false”.
It becomes “true” when user click this ticket via “Archive” button under “Done” column.

The test results are documented in `JestForTicket.docx` under under /kanban-ai-board-json/docs.

==========================================================================

## Known limitations
- JSON storage is not production-grade for concurrent writes
- recommendation is heuristic, not machine-learned
- AI explanation quality depends on the scoring summary and API availability
- Regressive Testings are done to review and validate AI-generated Code.

==========================================================================
