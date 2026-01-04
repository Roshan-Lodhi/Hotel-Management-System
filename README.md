# Hotel Management System _ 🏨 Grand Luxury Hotel 

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Fast-purple?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-teal?style=for-the-badge&logo=tailwindcss)


---

## 🚀 Live Demo
Check out the live application here: **[Grand Luxury Hotel Live](https://hotel-management0.vercel.app/)**

---

## 📖 About The Project

**Grand Luxury Hotel Management System** is a robust full-stack web application designed to digitize and streamline hotel operations. It serves as a centralized dashboard for managing guest interactions, room allocations, and billing processes.

Built with a focus on performance and user experience, this application replaces traditional manual logs with a secure, cloud-based solution, ensuring that staff can focus on delivering exceptional hospitality.

### Key Features
* **📊 Interactive Dashboard:** Real-time overview of hotel status and operations.
* **🔐 Secure Authentication:** Powered by Supabase for secure staff login and data protection.
* **🛏️ Room Management:** Efficient tracking of room availability and status.
* **💳 Billing & Invoicing:** Integrated billing system for generating guest invoices.
* **📱 Responsive Design:** Fully optimized for Desktops, Tablets, and Mobile devices.
* **⚡ High Performance:** Built on Vite for lightning-fast load times.

---

## 🛠️ Tech Stack

This project uses the latest modern web development technologies:

| Category | Technologies |
|----------|-------------|
| **Frontend** | React.js, TypeScript, Vite |
| **Styling** | Tailwind CSS, Shadcn UI, Radix UI |
| **Backend / DB** | Supabase (PostgreSQL) |
| **State Management** | TanStack Query (React Query) |
| **Form Handling** | React Hook Form + Zod Validation |
| **Deployment** | Vercel |

---

## 📸 Screenshots

*<img width="1846" height="863" alt="image" src="https://github.com/user-attachments/assets/3acde02c-7a8d-4e79-9156-cfd8643dc8c4" />


---

## 💻 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
* Node.js (v18 or higher) installed.
* npm (Node Package Manager).

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/hotel-management-system.git](https://github.com/your-username/hotel-management-system.git)
    cd hotel-management-system
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_PROJECT_ID="your_project_id_here"
    VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key_here"
    VITE_SUPABASE_URL="your_supabase_url_here"
    ```

4.  **Run the Project**
    ```bash
    npm run dev
    ```
    Open `http://localhost:8080` in your browser.

---

## 📂 Project Structure

```bash
src/
├── components/      # Reusable UI components (Buttons, Cards, Inputs)
├── integrations/    # Supabase connection & API logic
├── pages/           # Main Pages (Dashboard, Billing, Login)
├── hooks/           # Custom React Hooks
├── lib/             # Utilities (Tailwind merge, etc.)
└── App.tsx          # Main Routing & Layout
