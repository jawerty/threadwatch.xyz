import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/header.scss";

function Header() {
    const [modal, setModal] = useState(null);

    return <div className="header flex justify-between">
        <Link to="/">
            <span className="logo-link">
                threadwatch.xyz
            </span>
        </Link>
        {/* <div className="header-actions">
            <a href="#" onClick={(e) => { setModal("login") }}>
                What is this?
            </a>
        </div> */}
    </div>
}

export default Header;