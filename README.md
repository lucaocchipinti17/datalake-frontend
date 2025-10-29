# 🧠 Datalake Frontend

A modern web interface built with **React**, **TypeScript**, and **Vite** that interacts with the Datalake backend (Flask + MongoDB + AWS S3).  
This app provides an efficient, user-friendly platform to manage and visualize labeled image datasets stored in a centralized Datalake.

---

## 🚀 Overview

The **Datalake Frontend** is the client-side component of the Cyclope.AI data management platform.  
It enables data scientists and annotators to:
- Upload labeled metadata files and images.
- Query and filter large datasets by objects, timestamps, or camera parameters.
- Export subsets of images for model training, validation, and review.
- Manage clients, projects, and cameras through an admin interface.
- Track and visualize upload and export logs for quality assurance.

The system is designed to scale to millions of records while providing fast access and intuitive navigation.

---

## 🧩 Core Functionality

### 1. **Authentication**
- Login using credentials validated by the Flask backend.
- JWT tokens stored securely in local storage.
- Session-based routing protection — redirects unauthorized users to login.

### 2. **Dataset Management**
- Upload datasets (JSON or CSV) via drag-and-drop UI.
- Each upload automatically routes to the appropriate S3 bucket and project path.
- Metadata is parsed and sent to MongoDB for indexing.

### 3. **Search and Filtering**
- Query by:
  - Object count (e.g., “images with >3 pedestrians”)
  - Label categories
  - Camera ID or date range
- Optimized for high-performance querying using MongoDB indexes.

### 4. **Exports**
- Create export tasks to extract filtered subsets from the Datalake.
- Exports remain immutable (read-only copies).

### 5. **Admin Tools**
- Manage products, cameras, and clients.
- Configure project directories and permissions.
- Review data ingestion pipelines.

### 6. **Logs**
- Paginated list of uploads, exports, and user activity.
- View timestamps, file counts, and status messages.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React (TypeScript, Vite) |
| UI Framework | Material UI (MUI) |
| Styling | CSS + Emotion |
| State Management | React Hooks / Context |
| API | REST (Flask backend) |
| Data | AWS S3 + MongoDB |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js **v18+**
- npm, yarn, or pnpm

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/lucaocchipinti17/datalake-frontend.git

# 2. Navigate into the folder
cd datalake-frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

By default, Vite runs on [http://localhost:5173](http://localhost:5173).

---

## 🌐 Environment Configuration

Create a `.env` file in the project root:

```
VITE_API_BASE=http://localhost:5000
```

This should point to the Flask backend endpoint.  
Example for production:
```
VITE_API_BASE=https://api.cyclope.ai
```

---

## 🧪 Available Commands

| Command | Description |
|----------|-------------|
| `npm run dev` | Start local dev server |
| `npm run build` | Build the app for production (outputs to `/dist`) |
| `npm run preview` | Preview the built app locally |
| `npm run lint` | Run ESLint checks |

---

## 🧭 Folder Structure

```
src/
├── assets/              # Images, icons, static resources
├── components/          # Reusable UI elements
├── pages/               # Route-level components (Dashboard, Upload, Export, etc.)
├── api.ts               # REST API helper (uses VITE_API_BASE)
├── App.tsx              # App routes and layout
└── main.tsx             # Entry point
```

---

## 🧰 Development Notes

- All API requests are handled through `/src/api.ts`, referencing the environment variable `VITE_API_BASE`.
- Errors and loading states should be handled via Context or local state.
- Use **React Router** for navigation between modules.
- Admin and data modules are protected routes requiring authentication.

---

## 🚀 Deployment

To build for production:

```bash
npm run build
```

Then deploy the contents of the `/dist` folder to your preferred static hosting provider:
- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

If using client-side routing, configure your host to fallback to `index.html`.

---

## 🧭 Example Backend Integration

Example API request in `api.ts`:
```ts
export async function getCameras() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/cameras`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return await res.json();
}
```

---

## 🧭 Future Enhancements

- Token auto-refresh flow
- Multi-role access control (Admin/Annotator/Viewer)
- Enhanced export progress tracking
- Improved data visualization dashboard (charts for uploads/exports)

---

## 📄 License

This project was developed as part of a **Cyclope.AI internship**.  
© 2025 Cyclope.AI. All rights reserved.
