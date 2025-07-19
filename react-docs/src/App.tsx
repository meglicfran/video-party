import Toast from "./components/Toast/Toast";
import JoinRoom from "./components/JoinRoom/JoinRoom";
import MainScreen from "./components/MainScreen/MainScrenn";

/*
Websocket message:
    {
        type: 0 (control) | 1 (sync) | 2 (error)
        message: str
        paused: true | false,
        currentTime: double,
        duration: double
    }
*/

const LEAVE = 4;
const JOIN = 3;
const ERROR = 2;
const SYNC = 1;
const CONTROL = 0;

function App() {
	return (
		<>
			<Toast />
			<JoinRoom />
			<MainScreen />
		</>
	);
}

export default App;
