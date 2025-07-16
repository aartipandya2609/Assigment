'use strict';

// ############################################# //
// ##### Server Setup for Users Management API #####
// ############################################# //

// Importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
// Define the port for the server to listen on
const port = process.env.PORT || 5000; // You can change this port

// Middleware setup
// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());
// Enable Express to parse JSON formatted request bodies
app.use(express.json());

// MongoDB connection string.
// This string is generated from the inputs provided in the UI.
mongoose.connect('mongodb+srv://practical:1111@cluster0.ifamhov.mongodb.net/UserList', {
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the Express server only after successfully connecting to MongoDB
    app.listen(port, () => {
        console.log('Users API Server is running on port ' + port);
    });
})
.catch((error) => {
    // Log any errors that occur during the MongoDB connection
    console.error('Error connecting to MongoDB:', error);
});


// ############################################# //
// ##### Users Model Setup #####
// ############################################# //

// Define Mongoose Schema Class
const Schema = mongoose.Schema;

// Create a Schema object for the Users model
// This schema defines the structure of users documents in the MongoDB collection.
const usersSchema = new Schema({
    id: { type: Number, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true }
});

// Create a Mongoose model from the usersSchema.
// This model provides an interface to interact with the 'userss' collection in MongoDB.
// Mongoose automatically pluralizes "Users" to "userss" for the collection name.
const Users = mongoose.model("Users", usersSchema);


// ############################################# //
// ##### Users API Routes Setup #####
// ############################################# //

// Create an Express Router instance to handle users-related routes.
const router = express.Router();

// Mount the router middleware at the '/api/userss' path.
// All routes defined on this router will be prefixed with '/api/userss'.
app.use('/api/userss', router);

// Route to get all userss from the database.
// Handles GET requests to '/api/userss/'.
router.route("/")
    .get((req, res) => {
        // Find all users documents in the 'userss' collection.
        Users.find()
            .then((userss) => res.json(userss)) // If successful, return userss as JSON.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

// Route to get a specific users by its ID.
// Handles GET requests to '/api/userss/:id'.
router.route("/:id")
    .get((req, res) => {
        // Find a users document by its ID from the request parameters.
        Users.findById(req.params.id)
            .then((users) => res.json(users)) // If successful, return the users as JSON.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

// Route to add a new users to the database.
// Handles POST requests to '/api/userss/add'.
router.route("/add")
    .post((req, res) => {
        // Extract attributes from the request body.
        const id = req.body.id;
        const email = req.body.email;
        const username = req.body.username;

        // Create a new Users object using the extracted data.
        const newUsers = new Users({
            id,
            email,
            username
        });

        // Save the new users document to the database.
        newUsers
            .save()
            .then(() => res.json("Users added!")) // If successful, return success message.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

// Route to update an existing users by its ID.
// Handles PUT requests to '/api/userss/update/:id'.
router.route("/update/:id")
    .put((req, res) => {
        // Find the users by ID.
        Users.findById(req.params.id)
            .then((users) => {
                // Update the users's attributes with data from the request body.
                users.id = req.body.id;
                users.email = req.body.email;
                users.username = req.body.username;

                // Save the updated users document.
                users
                    .save()
                    .then(() => res.json("Users updated!")) // If successful, return success message.
                    .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
            })
            .catch((err) => res.status(400).json("Error: " + err)); // If users not found or other error, return 400.
    });

// Route to delete a users by its ID.
// Handles DELETE requests to '/api/userss/delete/:id'.
router.route("/delete/:id")
    .delete((req, res) => {
        // Find and delete the users document by ID.
        Users.findByIdAndDelete(req.params.id)
            .then(() => res.json("Users deleted.")) // If successful, return success message.
            .catch((err) => res.status(400).json("Error: " + err)); // If error, return 400 status with error message.
    });

    //I added the random user code in this
    app.get('/api/getrandomuser', async (req, res) => {
        try {
            const count = await Users.countDocuments();
            const random = Math.floor(Math.random() * count);
            const user = await Users.findOne().skip(random);
    
            if (!user) {
                return res.status(404).json({ error: "No users found." });
            }
    
            res.json(user);
        } catch (err) {
            console.error("Random user error:", err);
            res.status(500).json({ error: "Server error while fetching random user." });
        }
    });
    