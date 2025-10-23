# 🏡 StayScape  - <a href="https://stayscape-5um8.onrender.com" target="_blank">Live</a>



**StayScape** is a Full Stack Web Application inspired by Airbnb — allowing users to list, explore, and review stays from around the world.



## 🚀 Features

- 🧾 **User Authentication:** Secure login and signup using session-based authentication.
- 🏠 **CRUD Operations:** Users can create, read, update, and delete their own listings and reviews.
- ⭐ **Review System:** Users can add, edit, or delete reviews for different stays.
- 🌐 **RESTful Routes:** Clean and structured routing for smooth navigation and maintainability.
- 💬 **Dynamic Pages:** Interactive and responsive front-end views for an enhanced user experience.



## 🧩 Tech Stack

**Frontend:** HTML, CSS, JavaScript, EJS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Authentication:** Passport.js (Local Strategy)



## ⚙️ Installation & Setup

Follow these steps to run the project locally:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/StayScape-Live.git

# 2️⃣ Move into the project directory
cd StayScape

# 3️⃣ Install dependencies
npm install

# 4️⃣ Set up environment variables
# Create a .env file in the root folder with the following:
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

# 5️⃣ Run the application
node app.js
