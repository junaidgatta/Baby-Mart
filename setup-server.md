# Baby Mart Local Server Setup

To get your local server running, you have two options for the database:

### Option A: MongoDB Atlas (Cloud - Easiest)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2.  Create a new Cluster and find your **Connection String**.
3.  Open the file: `server/.env` 
4.  Replace `MONGO_URI` with your connection string. It should look like:
    `MONGO_URI=mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/babymart?retryWrites=true&w=majority`

### Option B: Local MongoDB (Advanced)
If you already have MongoDB installed locally:
1.  Open `server/.env`
2.  Set `MONGO_URI=mongodb://localhost:27017/babymart`

---

## 🏃 Starting the Server

Once the URI is set, run these commands in your terminal:

```powershell
# Go to server directory
cd server

# Update dependencies if needed
npm install

# Seed sample products (Do this once)
npm run seed

# Run the live server
npm run dev
```

The server will be live at `http://localhost:5000`. 
**Success message:** One you see `✅ MongoDB connected` and `🚀 Server running`, your server is active!
