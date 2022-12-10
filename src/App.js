import logo from './logo.svg';
import './App.css';
import KanbanBoard, { COLUMN_KEY_DONE, COLUMN_KEY_ONGOING, COLUMN_KEY_TODO } from './KanbanBoard';
import { useState } from 'react';

import AdminContext from './context/AdminContext';

function App() {
  const [todoList, setTodoList] = useState([{ title: '开发任务-1', status: '2022-12-07 22:41' }]);
  const [ongoingList, setOngoingList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const updaters = {
    [COLUMN_KEY_TODO]: setTodoList,
    [COLUMN_KEY_ONGOING]: setOngoingList,
    [COLUMN_KEY_DONE]: setDoneList,
  };

  const handleAdd = (column, newCard) => {
    updaters[column]((currentStat) => [newCard, ...currentStat]);
  };

  const handleRemove = (column, cardToRemove) => {
    updaters[column]((currentStat) =>
      currentStat.filter((item) => item.title !== cardToRemove.title),
    );
  };

  const handleToggleAdmin = (evt) => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <label>
          <input type="checkbox" value={isAdmin} onChange={handleToggleAdmin} /> 管理员模式
        </label>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <AdminContext.Provider value={isAdmin}>
        <KanbanBoard
          todoList={todoList}
          ongoingList={ongoingList}
          doneList={doneList}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </AdminContext.Provider>
    </div>
  );
}

export default App;
