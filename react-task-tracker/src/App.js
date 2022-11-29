import { useState, useEffect } from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
const[showAddTask, setShowAddTask] = useState(false)
const [tasks, setTasks] = useState([]);

useEffect(() => {
  const getTasks = async () => {
  const taskFromServer = await fetchTasks()
  setTasks(taskFromServer)
  }
 
  getTasks()

},[])

//fetch task
const fetchTasks = async () => {
const res = await fetch('http://localhost:5000/tasks');
const data = res.json();
return data
}

//Update tasks
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`);
  const data = res.json();
  return data
  }


//Add Task
const addTask = async (task) => {
const res = await fetch('http://localhost:5000/tasks',{
  method:'POST',
  headers: {
  'Content-type':'application/json'
  },
  body:JSON.stringify(task)
  })

  const data = await res.json()
  console.log(data)
  
  setTasks([...tasks, data])

 
  // const id = Math.floor(Math.random() * 1000) + 1
  // const newTask = { id, ...task}
  // setTasks([...tasks, newTask])
}

// Delete Task
const deleteTask = async (id)=> {
  await fetch(`http://localhost:5000/tasks/${id}`, {
  method:'DELETE'
  })
  setTasks(tasks.filter((task) => task.id !== id));
}

//Toggle Reminder
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id);
  const updatedTask= {...taskToToggle, reminder: !taskToToggle.reminder}
  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method:'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body:JSON.stringify(updatedTask)
  })

  const data = await res.json()


 setTasks(
  tasks.map((task) => 
  task.id === id ? {...task ,reminder:data.reminder} :
  task))
}
  return (
     
  <div className="container">
  <Header onAdd = {() => setShowAddTask (!showAddTask)} showAdd={showAddTask} />
 
  <Router>
    <Routes>
      <Route
       path="/"
        exact
        element = {
          <>
         { showAddTask && <AddTask  onAdd={addTask}/>}
        {tasks.length > 0 ? 
      (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />)
      : ('No Tasks to Show')
    }
        </>
        } />
      <Route path='/about' element={About} />
    </Routes>
  </Router>
  <Footer />
  </div>  
  );
}

export default App;
