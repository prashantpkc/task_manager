const express = require("express")
const { createUser, login, logout, changepassword} = require("../controllers/userController")
const { createTask, getTasks, getTasksByUser, updateTask, deleteTask, getTaskById, geteee } = require("../controllers/taskController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")

const route = express.Router()



route.post("/register", createUser)

route.post("/login",login)
route.get("/logout", logout)
route.patch("/changePassword", isAuthenticatedUser, changepassword)

//task

route.post("/createTask", isAuthenticatedUser, createTask)
route.get("/getTasks",isAuthenticatedUser,authorizeRoles("admin"),getTasks)
route.get('/myTasks',isAuthenticatedUser,getTasksByUser)
route.get('/getTaskById/:id',isAuthenticatedUser,authorizeRoles("admin"),getTaskById)


route.put('/task/:id',isAuthenticatedUser, updateTask)
route.delete('/task/:id',isAuthenticatedUser, deleteTask)
//aggregation

route.get("/geteee", geteee)

module.exports = route