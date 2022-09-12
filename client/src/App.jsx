import { useState } from 'react'
import Canvas from "./components/Canvas"
import SettingBar from "./components/SettingBar"
import Toolbar from "./components/Toolbar"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/:id'>
            <header>
              <Toolbar />
              <SettingBar />
            </header>
            <main>
              <Canvas />
            </main>
          </Route>
          <Redirect to={`f${(+new Date).toString(16)}`} />
        </Switch>

      </div>
    </Router>
  )
}

export default App
