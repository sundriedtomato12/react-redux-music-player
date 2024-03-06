import "./App.css"
import { MusicPlayer } from "./app/features/music-player/MusicPlayer"

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Redux Music Player</h1>
        <p>with my current favourite songs :p</p>
      </header>
      <MusicPlayer/>
    </div>
  )
}

export default App
