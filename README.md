# VibeBooks Frontend

[![Stack](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![Backend](https://img.shields.io/badge/Backend%20API-Java%20%26%20Spring-blue)](https://github.com/fabrodiego/VibeBooks-api)

[Versão em Português (README.pt-br.md)](README.pt-br.md)

## 💡 About The Project

**VibeBooks** is a fullstack social network for book lovers. The core concept is to connect readers with books that match the "Vibe" (Feelings) they are looking for in a read.

This repository contains the project's **Frontend** application, built in Angular.

## ✨ Features

* **Authentication:** User login and registration system.
* **Paginated Feed:** Main feed to view the latest book interactions.
* **Book Management:**
    * Add new books (via ISBN, with automatic fetching from the Google API).
    * Search existing books on the platform (by name).
* **Personal Interaction (Your "Vibe"):**
    * Set **Status** ("Want to Read", "Reading", "Read").
    * Set **Sentiments** ("Inspiring", "Tense", "Fun", etc.).
* **Social Interaction (The Community "Vibe"):**
    * **Sentiment Counts:** See which sentiments the community has tagged most for each book (updated in real-time).
    * **Likes:** Like books and comments.
    * **Comments:** Full comment system with a show/hide toggle.
* **User Profile:**
    * Edit user data and password.
    * Toggle the website theme (Light/Dark).
* **Responsive Design:** The book details modal adapts from a multi-column (desktop) to a stacked (mobile) layout.

## 💻 Tech Stack

This project utilizes the latest Angular stack.

* **Core:**
    * Angular: `20.3.2`
    * RxJS: `7.8.2`
    * TypeScript: `5.9.2`
* **Tooling:**
    * Angular CLI: `20.3.3`
    * Node.js: `22.19.0`
    * npm: `11.6.1`
* **Components & SSR:**
    * Angular Material: `20.2.5`
    * Angular SSR: `20.3.8`

## 🚀 Running Locally

### Prerequisites

* Node.js (v18 or higher)
* npm
* The [VibeBooks-api](https://github.com/fabrodiego/VibeBooks-api) backend must be running.

### 1. Clone the repository

```bash
git clone [https://github.com/fabrodiego/VibeBooks-frontend.git](https://github.com/fabrodiego/VibeBooks-frontend.git)
cd VibeBooks-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

For the frontend to communicate with the backend, the API URL must be configured.

Perform a global search in the project (in the `src/app/services/` folder) for the production URL and replace it with your local URL.

* **Find:** `https://api-vibebooks.fabrodiego.com`
* **Replace with:** `http://localhost:8080` (or your backend's port)

### 4. Run the project

```bash
ng serve
```

The app will be available at `http://localhost:4200`.

## 🔗 Backend

The backend for this project (Java/Spring API) is in a separate repository:

[github.com/fabrodiego/VibeBooks-api](https://github.com/fabrodiego/VibeBooks-api)
