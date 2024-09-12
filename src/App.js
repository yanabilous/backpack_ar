import BackpackConfigurator from "./components/BackpackConfigurator";
import {Route, Routes} from "react-router-dom";
import ARComponent from "./components/ARComponent";


function App() {
  return (
    <div className="App">
      <BackpackConfigurator/>

      <Routes>
        {/*<Route path="/" element={<BackpackConfigurator/>}/>*/}
        <Route path="/backpack" element={<ARComponent/>}/>
      </Routes>

    </div>
  );
}

export default App;
