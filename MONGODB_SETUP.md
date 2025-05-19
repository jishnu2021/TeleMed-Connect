# MongoDB Atlas Setup Guide

## Step 1: Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account if you don't have one
2. Create a new organization if needed

## Step 2: Create a New Cluster
1. In your Atlas dashboard, click "Build a Database"
2. Choose the FREE tier (shared cluster)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "TeleMedCluster")
5. Click "Create Cluster"

## Step 3: Configure Database Access
1. While your cluster is being created, go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Create a user with a secure username and password (remember these!)
4. For user privileges, select "Atlas admin" for simplicity
5. Click "Add User"

## Step 4: Configure Network Access
1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. For development, you can add "0.0.0.0/0" to allow access from anywhere
   (Note: For production, you should restrict to specific IPs)
4. Click "Confirm"

## Step 5: Get Your Connection String
1. Go to "Database" in the left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your database user credentials
6. Replace `myFirstDatabase` with `telemeddatabase`

## Step 6: Update Your Application

### Update .env file
Create or modify your `.env` file in the Serverside directory:
```
MONGODB_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/telemeddatabase?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Update seed-doctors.js (optional)
If you want to seed the database with sample doctors:
1. Update the MongoDB connection string in `seed-doctors.js`
2. Run `node seed-doctors.js` to populate the database

## Step 7: Start Your Server
1. Go to the Serverside directory
2. Run `node index.js`
3. Verify the connection with: "✅ MongoDB connected" message

## Step 8: Test Registration and Appointment Booking
1. Register a new doctor through your application
2. Check the MongoDB Atlas dashboard to verify the doctor is added
3. Test the appointment booking flow to see if registered doctors appear

## Troubleshooting
- If you see connection errors, check your network settings and connection string
- Verify the database user credentials are correct
- Make sure your IP is allowed in the Network Access settings
- Check the MongoDB Atlas status page for any service issues 