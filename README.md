# Event Management Fullstack Project

This is a fullstack Event Management application built with a MERN stack (MongoDB, Express.js, React, and Node.js). The project allows users to create, edit, filter, and delete events.

## Features
- **Create Event**: Add new events with necessary details.
- **Edit Event**: Modify existing event information.
- **Filter Event**: Search and filter events based on criteria.
- **Delete Event**: Remove unwanted events.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js
- npm or yarn
- MongoDB Atlas account (or a local MongoDB setup)
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**
```bash
https://github.com/Kish202/Swissmote-Assignment.git
cd event-management
```

2. **Backend Setup**
```bash
cd backend
```

Create a `.env` file and add the following variables:
```
MONGODB_URI=mongodb+srv://YourUrl
PORT=5000
JWT_SECRET=your_very_secure_secret_key
CLOUDINARY_URL=cloudinary://xxxx
Cloud_Name='xxxxx'
api_key='86xxxxxxx'
api_secret='xxxxxxxx'
```

Install dependencies:
```bash
npm install
```

Start the backend server:
```bash
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend
```

Create a `.env` file and add the following variable:
```
VITE_API_URL=http://localhost:5000
```

Install dependencies:
```bash
npm install
```

Run the frontend server:
```bash
npm run dev
```

4. **Run both frontend and backend**
Ensure both servers are running simultaneously:
```bash
# In one terminal for backend
cd backend
npm run dev

# In another terminal for frontend
cd frontend
npm run dev
```

## Usage
Once both servers are up and running, open your browser and visit the frontend:

[Event Management App](https://eventmanagement-nine-zeta.vercel.app/auth)

## Technologies Used
- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Image Hosting**: Cloudinary
  **RealTime Message**:Web Sockets
## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a Pull Request.

## License
This project is licensed under the MIT License.

---

Happy coding! 🎉


https://eventmanagement-nine-zeta.vercel.app/auth
