import { useEffect } from 'react';
import {
  BrowserRouter as  Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';
import { connectWithWebSocket } from './utils/wssConnection/wssConnection';
import Dashboard from './Dashboard/Dashboard';
import LoginPage from './LoginPage/LoginPage';

function App() {
  useEffect(() => {
    connectWithWebSocket();    
   }, []);
  return (
    <Router>
      <Switch>
        <Route path='/dashboard'>
          <Dashboard />
        </Route>
        <Route path='/'>
          <LoginPage/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
