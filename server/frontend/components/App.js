import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import "../styles/index.scss";

import Thread from "./Thread";
import FrontPage from "./FrontPage";
import Header from "./Header";

function App() {
	return (
		<Router>
			<div className="app">
				<Header />
				<Switch>
					<Route exact path="/">
						<FrontPage />
					</Route>
					<Route exact path="/t/:threadShortId">
						<Thread />
					</Route>
				</Switch>
			</div>
		</Router>

	)
}

export default App;