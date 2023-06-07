
const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignee } =
      req.body;

    let task = await Task.create(req.body);

    res
      .status(201)
      .send({ status: true, message: "task created successfully", data: task });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//admin
exports.getTasks = async (req, res) => {
  try {
    let tasks = await Task.find();

    return res
      .status(200)
      .send({ status: true, message: "successfully", data: tasks });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//user can see his own all tasks
exports.getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    if (tasks.length === 0) {
      return res.status(404).json({ status: false, message: "No tasks found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Success", data: tasks });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
    try {
      const id = req.params.id;
  
      const task = await Task.findById(id);
  
      if (!task) {
        return res.status(404).json({ status: false, message: "Task not found" });
      }
  
      return res.status(200).json({ status: true, message: "Success", data: task });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status, priority, dueDate },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




