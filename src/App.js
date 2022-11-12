import './App.css';
import Header from './components/Header';
import Tasks from './components/Tasks';
import {useState , useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AddTasks from './components/AddTasks';
import Footer from './components/Footer';
import About from './components/About';


function App() {
  const [showAddTask , setShowAddTask] = useState(false)
  const [tasks,setTasks] = useState([])

  useEffect(() =>{
    const getTasks = async()=>{
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
     getTasks()
  } , [])

  //Fecth Tasks
  const fetchTasks = async () =>{
    const res =  await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }
  //Fecth Task
  const fetchTask = async (id) =>{
    const res =  await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }
  //Add Task
  const addTask =async (task) =>
  {
    const res =  await fetch('http://localhost:5000/tasks',{
      method : 'POST',
      headers : {
        'Content-type': 'application/json',
      },
      body : JSON.stringify(task),
    })
    const data =await res.json()

    setTasks([...tasks, data])
    
    // const id = Math.floor(Math.random() * 10000 )+ 1
    // const newTask = {id ,task}
    // setTasks([task,newTask])
  }

 //Delet Task
  const deleteTask = async (id) =>{
    await fetch(`http://localhost:5000/tasks/${id}`,{method:'DELETE'})
    setTasks(tasks.filter((task)=> task.id !==id))
  }
  //ToggleReminder
  const togglereminder =async(id) =>{ 

    const taskToToggle = await fetchTask(id)
    const upTask = {...taskToToggle,
    reminder: !taskToToggle.reminder}
    
    const res = await  fetch(`http://localhost:5000/tasks/${id}`,{
      method : 'PUT',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify(upTask)
    })

    const data = await res.json()

    setTasks(
        tasks.map((task)=>
        task.id === id ?{ ...task,reminder:data.reminder}:task
      )
    )
  }
  return (
    <Router>
    <div className="container">
      <Header 
          onAdd={ ()=> setShowAddTask(!showAddTask)} 
          showAdd ={showAddTask}
      />
      <Routes>
        <Route 
         path='/'
         element = {
          <>    
            {showAddTask && <AddTasks onAdd={addTask}/>}
            {tasks.length > 0 ? (
            <Tasks tasks={tasks} onDelete={deleteTask} onToggle={togglereminder}/>
            ):(
              'No Tasks To Show'
            )}    
          </>
         }
        />
      </Routes>
      <Route path='/about' element={About}/>
      
      <Footer />
    </div>
    </Router>
  );
}

export default App;
