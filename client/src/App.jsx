import "./App.css";
import { ChatClient } from "./components/ChatClient.jsx";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <ChatClient/>
    </div>
  );
}

export default App;
