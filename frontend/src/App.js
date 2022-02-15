import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { TODOLIST_ABI, TODOLIST_ADDRESS } from "./config";

function App() {
  const [account, setAccount] = useState();
  const [todoList, setTodoList] = useState();
  const [loading, setLoading] = useState(true);
  const [taskCount, setTaskCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  async function load() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);

    const todoList = new web3.eth.Contract(TODOLIST_ABI, TODOLIST_ADDRESS);
    setTodoList(todoList);

    const taskCount = await todoList.methods.taskCount().call();
    setTaskCount(taskCount);

    for (let i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call();
      setTasks((prevState) => [...prevState, task]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const createTask = (txt) => {
    setLoading(true);
    todoList?.methods
      ?.createTask(txt)
      .send({
        from: account,
      })
      .once("reciept", (receipt) => {
        setLoading(false);
      });
  };

  const toggleCompleted = (param) => {
    setLoading(true);
    todoList?.methods?.toggleCompleted(param)?.send({
      from: account
    }).once("reciept", (receipt) => {
      setLoading(false);
    })
  }

  const deleteTask = (param) => {
    setLoading(true);
    todoList?.methods?.deleteTask(param).send({
      from: account
    }).once("reciept", () => {
      setLoading(false);
    })
  }

  console.log("TodoList: ", tasks);

  return (
    <div>
      Your account is: {account}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTask(text);
        }}
      >
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="add task here..."
        />
        <input type="submit" />
      </form>
      <div>
        {/* <h5>Task Count: {taskCount}</h5> */}
      </div>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          {tasks?.map((task, index) => {
            return (
              <>
              {task?.content.length && task?.id !== 0 ? (
                <div key={index}>
                  <div style={{ display: 'flex', marginRight: '0.5rem', alignItems: 'center' }}>
                    <input name={task?.id} defaultChecked={task?.completed} type="checkbox" onClick={() => toggleCompleted(task?.id)} />
                    <h5> Task: {task?.content} </h5>
                  </div>
                  <button onClick={() => deleteTask(task?.id)}>Delete</button>
                </div>
              ) : (
                null
              )}
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
