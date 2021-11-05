import { useState } from "react";

import '../styles/reaction-voter.scss';

function ReactionVoter({ initCount, type, commenterId }) {
    const [count, setCount] = useState(initCount);
    const [countSet, setCountSet] = useState(false);

    const getEmoji = () => {
        if (type === "hearts") {
            return "❤️";
        } else if (type === "angrys") {
            return "😠";
        } else if (type === "laughs") {
            return "😂";
        } else if (type === "rockets") {
            return "🚀";
        }
    }

    const emojiClick = async () => {
        if (countSet) return;
        const rawResponse = await fetch(`/api/commenter/${commenterId}?reaction=${type}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const content = await rawResponse.json();
        if (content.success) {
            setCount(count + 1);
            setCountSet(true);
        }
    }
    return <div className="reaction-voter" onClick={(e) => emojiClick()}>
        {getEmoji()} <span>{count}</span>
    </div>
}

export default ReactionVoter;