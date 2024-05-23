import { FormControl, Input, InputLabel, Button, List, ListItemText } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import React from "react";

const TaskList = () => {
    const backendUrl = "http://localhost:3000/";

    // declaring all state variables
    const [taskId, setTaskId] = React.useState(0);
    const [toggle, setToggle] = React.useState(false);
    const [todoItem, setTodoItem] = React.useState("");
    const [todoArray, setTodosArray] = React.useState([]);

    // function to get all the tasks
    function fetchAllTasks() {
        axios
            .get(backendUrl)
            .then((result) => {
                if(result?.status === 200) {
                    let { data } = result;

                    setTodosArray(data);
                }
            })
            .catch((error) => console.log(error));
    }

    // function to add/update a new task
    function addTask() {
        let taskObj = {};

        // update
        if(toggle) {
            let taskWords = todoItem.split("-");

            taskObj.id = taskId;
            taskObj.name = taskWords[0];
            taskObj.description = taskWords[1];
            taskObj.status = taskWords[2];

            axios
                .put(`${backendUrl}update-task/${taskId}`, taskObj)
                .then((res) => {
                    if(res.status === 201) {
                        setTodoItem("");
                        fetchAllTasks();
                        setToggle(false);
                    }
                })
                .catch((error) => { console.log(error) });
        // add
        } else if(toggle === false) {
            taskObj.id = uuidv4();
            taskObj.name = "";
            taskObj.description = todoItem;
            taskObj.status = "todo";

            axios({
                method: "POST",
                url: `${backendUrl}add-task`,
                data: taskObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if(res.status === 201) {
                    setTodoItem("");
                    fetchAllTasks();
                }
            })
            .catch((error) => console.log(error));
            }
    }

    // function to change the button name from Add to Update and store the to be updated task id
    function updateTask(task) {
        setToggle(!toggle);
        setTodoItem(`${task?.name}-${task?.description}-${task?.status}`);
        setTaskId(task?.id);
    }

    // function to delete a specific task
    function deleteTask(taskId) {
        axios
            .delete(`${backendUrl}delete-task/${taskId}`)
            .then((res) => {
                if(res.status === 200){
                    setTodosArray(res.data);
                }
            })
            .catch((error) => console.log(error))
    }

    React.useEffect(() => {
        fetchAllTasks();
    }, []);

    return (
        <div>
            <h1>Task Management App</h1>

            <FormControl>
                <InputLabel htmlFor="my-input">Task Description</InputLabel>
                <Input
                    style={{ margin: '20px 0' }}
                    id="my-input" 
                    value={todoItem} 
                    onChange={(event) => { setTodoItem(event.target.value) }} 
                    aria-describedby="my-helper-text" />

                <Button 
                    size="small" 
                    color="success" 
                    disabled={ todoItem === "" }
                    onClick={() => { addTask() }} 
                    variant="contained">{`${toggle === true ? "Update Task" : "Add Task"}`}</Button>

                {/* COULDN'T IMPLEMENT FILE UPLOAD FUNCTIONALITY DUE TO THE TIME CONSTRAINTS */}
                {/* <Input
                    type="file"
                    style={{ margin: '20px 0' }}
                    aria-describedby="my-helper-text" />

                <Button size="small" color="success" variant="contained">Upload File</Button> */}
            </FormControl>

            {
                todoArray.length > 0 ? (
                    <List style={{ margin: '40px auto', maxHeight: '20vh', overflow: 'auto' }}>
                        {todoArray?.map((todo) => {
                            return (
                                <ListItemText key={todo?.id}>
                                    {`${todo?.name}-${todo?.description}-${todo?.status}`}
                                    <Button style={{ margin: '0 5px 0 15px'}} onClick={() => { updateTask(todo) }} color="primary" variant="outlined">edit</Button>
                                    <Button onClick={() => { deleteTask(todo?.id) }} color="error" variant="outlined">delete</Button>
                                </ListItemText>
                            )
                        })}
                    </List>
                ) : null
            }
        </div>
    )
}

export default TaskList;
