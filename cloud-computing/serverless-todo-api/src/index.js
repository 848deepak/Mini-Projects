const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const todoController = require("./controllers/todoController");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/todos", todoController.getTodos);
app.get("/todos/:id", todoController.getTodoById);
app.post("/todos", todoController.createTodo);
app.put("/todos/:id", todoController.updateTodo);
app.delete("/todos/:id", todoController.deleteTodo);

// Catch-all
app.use((req, res) => {
  return res.status(404).json({ error: "Not Found" });
});

module.exports.handler = serverless(app);
