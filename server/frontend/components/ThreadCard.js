import { Link } from "react-router-dom";
import "../styles/thread-card.scss";

function ThreadCard({ thread }) {
    return <Link to={`/t/${thread?.threadShortId}`} className="thread-card-link">
        <div className="thread-card">
            <img
                className="thread-card__screenshot"
                src={`/screenshots/${thread?.threadShortId}.png`} />
            <div className="thread-card__content flex flex-column">
                <h3>{thread?.title}</h3>
            </div>
        </div>
    </Link>
};

export default ThreadCard;
