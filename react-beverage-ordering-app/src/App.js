import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import {Provider} from 'react-redux';
import BeverageOrderForm from './components/BeverageOrderForm'; 
import AdminListView from './components/AdminListView';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" exact component={HomePage}/>
            <Route path="/customerview" component={CustomerView}/>
            <Route path="/adminview" component={AdminView}/>
            <Route path="/beverageorderform" component={BeverageOrderForm}/>
            <Route path="/adminlistview" component={AdminListView}/>
          </Switch>
        </Router>
    </Provider>
  );
}

export default App;
