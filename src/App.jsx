import './App.css'
import { useState, useEffect } from 'react'
import confetti from "canvas-confetti"

let nextId = 1;

export default function App() {
  const [todoElements, setTodoElements] = useState([]);
  const [newText, setNewText] = useState("");

  const [confettiRun, setConfettiRun] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [fileUsername] = useState("L1ngW4ng");
  const [filePassword] = useState("myPassword123");
  

  const [showLogin, setShowLogin] = useState(false);

  const [loggedInUsername, setLoggedInUsername] = useState("");
  

  function celebrate() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  }

  function AddNote() {
    if (!newText.trim()) return;
    const newTodo = {
      id: nextId++,
      text: newText,
      working: false,
      done: false,
      date: date,
      time: time
    };
    setTodoElements([...todoElements, newTodo]);
    setNewText("");
    setDate("");
    setTime("");
  }

  function DeleteNote(id) {
    setTodoElements(todoElements.filter(todo => todo.id !== id));
  }

  function toggleWorking(id) {
    setTodoElements(todoElements.map(todo => {
      if (todo.id === id) {
        return { ...todo, working: !todo.working, done: false };
      }
      return todo;
    }));
  }

  function toggleDone(id) {
    setTodoElements(todoElements => {
      const todo = todoElements.find(todo => todo.id === id);
      if (!todo) return todoElements;

      if (!todo.done) {
        celebrate();
        return todoElements.filter(todo => todo.id !== id);
      }
      else {
        return todoElements.map(todo => todo.id === id ? { ...todo, done: false } : todo);
      }
    });
  }

  function handleLogin() {
    if(username === fileUsername && password === filePassword) {
      setLoggedInUsername(username);
      setShowLogin(false);
      setUsername("");
      setPassword("");
    }
    else {
      alert("Wrong username or password");
    }
  }


  useEffect(() => {
    if (confettiRun) {
      const timer = setTimeout(() => {
        setConfettiRun(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [confettiRun]);


  return (
    <div className='App'>
      <header>
        <h1>TODO App</h1>
      </header>

      <div className='user'>
        <label className='user-label'>{ loggedInUsername ? `Logged in as: ${loggedInUsername}` : ""}</label>

        {!showLogin && !loggedInUsername && (
          <button className='login-button' onClick={() => setShowLogin(true)}>Login</button>
        )}



        {showLogin && (
          <div className='loginBox'>
            <label>Username:</label>
            <input className='login-input' type="text" value={username} onChange={e => setUsername(e.target.value)} />

            <label>Password:</label>
            <input className='login-input' type="password" value={ password } onChange={e => setPassword(e.target.value)} />

            <button className='login-button' onClick={() => { handleLogin()}}>Login</button>
          </div>
        )}
      </div>

      <div className='controls'>
        <input
          className="todo-input"
          type="text"
          value={newText}
          placeholder="Write your task..."
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => {
            if(e.key === "Enter") {
              AddNote();
            }
          }}
        />
        <input className='todo-deadline-date' type="date" value={date} onChange={ e => setDate(e.target.value) }/>
        <input className='todo-deadline-time' type="time" value={time} onChange={ e => setTime(e.target.value) }/>
        { confettiRun && <Confetti run={ confettiRun }/> }
        <button className='control-buttons' onClick={AddNote}>Add</button>
      </div>

      <div className='todo-list'>
        <h3 className='list-header'>This is the list for all TODOs</h3>
        <hr />
        {todoElements.length === 0 ? (
          <p style={{
            color: 'white',
            fontStyle: 'italic',
            fontSize: '1rem',
            marginTop: '20px'
          }}>
            No current tasks...
          </p>
        ) : (
          todoElements.map(todo => (
            <div key={todo.id} className="todo-object">
              <button className="delete-button" onClick={() => DeleteNote(todo.id)} title='Delete'>🗑️</button>
              <div className='todo-text'>{todo.text}</div>
              <div>{todo.date} {todo.time}</div>
              <div className='spacer' />

              <div className="emoji-toggle">
                <span
                  className={`emoji-label ${todo.working ? 'selected' : ''}`}
                  title="Working on it"
                  onClick={() => toggleWorking(todo.id)}
                >
                  ✏️
                </span>

                <span
                  className={`emoji-label ${todo.done ? 'selected' : ''}`}
                  title="Done"
                  onClick={() => toggleDone(todo.id)}
                >
                  ✅
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
