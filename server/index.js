require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Middleware
app.use(express.json());
app.use(cors(
    { origin: ["http://localhost:5173"], 
    credentials: true 

    }));

// Database connection
mongoose.connect('mongodb+srv://bhushann795:naga795@cluster0.b9xex.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Define the ToDo schema and model
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes

// Register
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('All fields are required');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(400).send('Error registering user');
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Protected route
app.get('/home', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).send('Access denied');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        res.send('Welcome to the Home Page from backend side');
    });
});

app.get("/" , (req , res) =>{
    res.json("hello");
})
// Routes for CRUD Operations
const verifyUser = async (req , res , next) => {
    try {
        

        let token  = req.body.token;
        if (token === undefined){
             token = req.headers.authorization.split(' ')[1];
        }
        // console.log(token);
        const decodedToekn = jwt.verify(token , SECRET_KEY)
        req.userId = decodedToekn.id;

        next()
        
        
    } catch (error) {
        console.log(error);
        
    }
}

// 1. Create a new ToDo
app.post('/todos',verifyUser ,  async (req, res) => {

    const { title, isCompleted } = req.body;

    if (!title ) {
        return res.status(400).json({ error: 'Title and User ID are required' });
    }
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newTodo = new Todo({ title, isCompleted, user: userId });
        await newTodo.save();
        res.status(201).json(newTodo);

    } catch (error) {
        res.status(500).json({ error: 'Failed to create ToDo' });
    }
});

// 2. Read all ToDos
app.get('/todos',verifyUser, async (req, res) => {
    try {
        const todos = await Todo.find().populate('user', 'name email');
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ToDos' });
    }
});

//find todos of a user
app.get('/todos/user/:token' , async( req , res) =>{
    const token = req.params.token;
    const decodedToekn = jwt.verify(token , SECRET_KEY)
    // console.log(decodedToekn);

    const userId = decodedToekn.id;

    try {
        const todos = await Todo.find({ user: userId }).select('title _id completed');

        res.status(200).json(todos)
    } catch (error) {
        console.log(error);
        
    }

})

// 3. Read a single ToDo by ID
app.get('/todos/:id',verifyUser, async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await Todo.findById(id).populate('user', 'name email');
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ToDo' });
    }
});

// 4. Update a ToDo by ID
app.put('/todos/:id',verifyUser, async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {

        const todo = await Todo.findByIdAndUpdate(id, { title }, { new: true, runValidators: true });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({
            message : "todo updated successfully",
            todo
        }
        
        );
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ToDo' });
    }
});

// 5. Delete a ToDo by ID
app.delete('/todos/:id',verifyUser ,  async (req, res) => {
    const { id } = req.params;
    console.log(`delete id : ${id}`);
    
    try {
        const todo = await Todo.findByIdAndDelete(id);
        console.log(`from delete route : ${todo}`);
        
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json({
            message : "todo delete successfully",
            todo
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ToDo' });
    }
});

//mark todo as completed 

app.put("/todos/completed/:id", verifyUser, async (req, res) => {
    try {
        const id = req.params.id;

        // Find the todo by ID
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found",
            });
        }

        // Update the completed status
        todo.completed = !todo.completed;

        // Save the updated todo
        await todo.save();

        // Send a success response
        return res.status(200).json({
            message: "Todo marked as completed",
            todo,
        });
    } catch (error) {
        // Handle any errors
        return res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
