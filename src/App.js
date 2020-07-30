import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from 'pages/login/Login.jsx';
import Admin from 'pages/admin/Admin.jsx';

function App() {
  console.log(Admin);
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/" component={Admin}></Route>
      </Switch>
    </div>
  );
}

export default App;
