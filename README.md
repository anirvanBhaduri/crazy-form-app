# Crazy Form App

This is a monorepo project with a React frontend and a Node.js/Express backend (TypeScript).
It houses the MVP of the app Bryan and Anirvan scaffolded together during an interview.

## Structure

- `frontend/` — React app (Vite, TypeScript)
- `backend/` — Node.js, Express, TypeScript API

## Getting Started

### 1. Install dependencies

```sh
cd frontend && npm install
cd ../backend && npm install
```

### 2. Run the apps

#### Frontend

```sh
cd frontend
npm run dev
```

#### Backend

```sh
cd backend
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173) (default Vite port)
- Backend: [http://localhost:3001](http://localhost:3001)

## MVP

### Requirements

#### Functional

- Needs to work offline on the browser
- User must be logged in to view/edit form
- Allowed to use max 10MB of storage
- Can create a new form
- Cannot edit a form once it's been published
- Requires user form data to be stored somewhere for retrieval/analytics later
- Form data needs to be synced between users

#### Non Functional

- Server for syncing data needs to have 99% uptime. E.g. if up for a week, only 1% of the time of the week is allowed as downtime.
- Must be secure

### Frontend

Needs to be a local first app such that it can work on the browser while "offline". Stores data in indexedDB. Syncs with backend
once online.

### Backend

Stores replica of local app on server, for all users. Does this as one of the requirements is to be able to use
the data for analytics at a later stage.

## Thoughts

Form data needs to be synced between users. If the users are in the same location AND they are all offline, they COULD
use bluetooth to sync data between their devices. If they are to be offline for an extended period of time AND they
require the data to be synced between their devices, then they would HAVE to use something like bluetooth to sync
between their devices. Since this is not a requirement explicitly stated, one would need to enquire about this. Also,
since we already need the server due to one of the requirements, the MVP could omit bluetooth syncronisation between
devices. We would prompt the users to either be online OR utilise one device when all offline AND in one location. We would
also state that we do not support multi-location syncronisation of form data in the MVP, unless, they are online.

We should enquire about whether they need to view forms once they have been published, despite not being able to edit them.

Simplest solution with regards to users would be to give a department say, only one user login. A given user can push forms to
our server and only retrieve forms they pushed. This same user could login into different devices. Another, based on followup requirements,
could be to bake in a company/department type separation, allowing multiple users for a given group. I would push this to M2, based on
how critical a requirement this is.

## Milestones

### M1

Simple browser app that works offline with a simple UI allowing one to create/edit/publish forms. User needs to login to use, thus,
they need to initially be online to login and therein can use the app online or offline. We will need to enquire with the user to find out
how long they intend to be offline while using the application. Let's assume they say max 1 day. We can set the expiry of the login
token to 1 day. We will keep it very simple and simply count 1 day from the first login, without doing any smart logic like them coming back online
before a day is over or displaying activity, etc.

Simple backend that allows one to retrieve created/published form/forms AND allows one to push created/edited/published forms to
the server. The server should be stateless as we require 99% uptime, therefore requiring at least one replica of the server, alleviating
the one point of failure. Therefore, we require a database to store the form data. We also require this database to have a replica such that
we can help guarantee the 99% uptime. We should enquire with the customer here to know what kind of data they need on their forms. If the form
can/will be changed often, having different versions, we would need a NoSQL DB. If the form is to be very structured and NOT change often, we could
use an RDMS, e.g. PostgreSQL. We will assume here we have talked to the customer and found out that forms can be dynamic, therefore, we go ahead with
say MongoDB.

Syncronisation is kept very very simple. Therefore, we could ONLY allow one to push a form to the server once it has been PUBLISHED.
This way, we do not need to handle syncronisation of forms that are still work in progress. Other devices can sync by simply pulling
published forms from the server and viewing them.

Contract for GET /forms

```json
{
  "forms": [
    {
      "formId": "uuidV7",
      "formType": "maintenance",
      "data": {
        "name": "Pipes",
        "description": "Needs repair due to rust"
      },
      "published": true
    }
  ]
}
```

Contract for POST /form. Only require post as we would only ever push the form to the server
upon publishing.

```json
{
  "formId": "uuidV7",
  "formType": "maintenance",
  "data": {
    "name": "Floor",
    "description": "Crack in the floor. Requires re-sealing."
  },
  "published": true
}
```

Login endpoint. To be described here. If there was no backend, we wouldn't require any kind of authentication provider either.
The authentication could be purely local. But since we have a requirement of having a server that allows syncing between devices,
we require authentication. We enquire with the users and see that they all use google. So we go ahead and setup Google as the
identity provider and use that for authentication on our app and server.

### M2

Work on auth roles/groups in order to separate data.

### M3

Introduce form change history for local and server. Git like system.

### M4

Work on smarter/more complex variant of syncronising data. Allow forms to have drafts.
Build reconciliation logic on server. Allow local to become aware of reconciled data, only when online.

### M5

Synchronise between devices using bluetooth. Use previous milestone's reconciliation logic to reconcile multiple devices working
offline using bluetooth to synchronise with the server once back online.

### M6

Synchronise between devices using websockets when online.

## TODO

- add frontend for viewing published forms
- creating new form
- syncing forms from server (min every 10 seconds)
- editing a new form and publishing it

- add backend with auth endpoint
- GET /forms endpoint - only returns published forms
- POST /form endpoint - only allows creating a published form

- NO DRAFTS in M1
