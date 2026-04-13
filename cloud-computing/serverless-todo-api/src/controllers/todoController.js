const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

const TODOS_TABLE = process.env.TODOS_TABLE;

exports.getTodos = async (req, res) => {
  try {
    const params = { TableName: TODOS_TABLE };
    const { Items } = await dynamoDb.send(new ScanCommand(params));
    res.json(Items || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve todos" });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const params = {
      TableName: TODOS_TABLE,
      Key: { id: req.params.id },
    };
    const { Item } = await dynamoDb.send(new GetCommand(params));
    if (Item) {
      res.json(Item);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve todo" });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (typeof title !== 'string') {
      return res.status(400).json({ error: '"title" must be a string' });
    }

    const todoId = uuidv4();
    const newTodo = {
      id: todoId,
      title,
      completed: completed || false,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: TODOS_TABLE,
      Item: newTodo,
    };

    await dynamoDb.send(new PutCommand(params));
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create todo" });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { title, completed } = req.body;
    
    // Build update expression dynamically based on provided fields
    let updateExpression = "set";
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    if (title !== undefined) {
      updateExpression += " #t = :title,";
      expressionAttributeNames["#t"] = "title";
      expressionAttributeValues[":title"] = title;
    }
    
    if (completed !== undefined) {
      updateExpression += " #c = :completed,";
      expressionAttributeNames["#c"] = "completed";
      expressionAttributeValues[":completed"] = completed;
    }

    // Remove trailing comma
    updateExpression = updateExpression.slice(0, -1);

    if (Object.keys(expressionAttributeValues).length === 0) {
      return res.status(400).json({ error: "No update fields provided" });
    }

    expressionAttributeValues[":updatedAt"] = new Date().toISOString();
    updateExpression += ", updatedAt = :updatedAt";

    const params = {
      TableName: TODOS_TABLE,
      Key: { id: req.params.id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    const { Attributes } = await dynamoDb.send(new UpdateCommand(params));
    res.json(Attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update todo" });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const params = {
      TableName: TODOS_TABLE,
      Key: { id: req.params.id },
    };
    await dynamoDb.send(new DeleteCommand(params));
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete todo" });
  }
};
