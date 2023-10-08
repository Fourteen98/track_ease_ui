import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Home} from "./pages/Home.tsx";
import {ViewTracking} from "./pages/ViewTracking.tsx";
import {Navbar} from "./components/Navbar.tsx";
import {ActivateTracking} from "./pages/ActivateTracking.tsx";


export default function App() {

    return (
        <>
            <Router>
                <div className={""}>
                    <Navbar />
                    <Routes>
                        <Route path="" element={<Home />} />
                        <Route path="activate-tracking" element={<ActivateTracking />} />
                        <Route path="view-tracking" element={<ViewTracking/>} />
                    </Routes>
                </div>
            </Router>
        </>
    )
}

