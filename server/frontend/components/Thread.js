import { useParams } from "react-router";
import { useEffect, useState } from "react";
import "../styles/thread.scss";

import CommenterView from "./CommenterView";
import ThreadCard from "./ThreadCard";

function Thread() {
    const { threadShortId } = useParams();
    const [thread, setThread] = useState(null);
    const [recentThreads, setRecentThreads] = useState([]);
    const [commenters, setCommenters] = useState([]);

    const pruneTitle = (title) => {
        if (!title) return "";
        if (title.length > 100) {
            const words = title.split(' ')
            let charCount = 0;
            let newTitle = ""
            for (let word of words) {
                charCount += word.length
                if (charCount >= 100) {
                    newTitle += word + "..."
                    break;
                } else {
                    newTitle += word + " "
                }
            }
            return newTitle;
        }
        return title;
    }

    useEffect(async () => {
        const rawResponse = await fetch(`/api/thread/${threadShortId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const content = await rawResponse.json();
        console.log(content)
        setThread(content.thread);
    }, [threadShortId])

    useEffect(async () => {
        const commenters = [];
        for (let commenterId of thread?.commenters) {
            const rawResponse = await fetch(`/api/commenter/${commenterId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const content = await rawResponse.json();
            commenters.push(content.commenter)
        }

        setCommenters(commenters)
    }, [thread?.commenters]);

    useEffect(async () => {
        const rawResponse = await fetch(`/api/thread?recent=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const content = await rawResponse.json();

        setRecentThreads(content.threads)
    }, []);

    return <div className="thread flex flex-column">
        <div className="thread__content flex flex-row">
            <div className="left flex flex-column">
                <h1 className="thread__title">{pruneTitle(thread?.title)}</h1>
                {thread?.screenShotCreated
                    && <img
                        className="thread__screenshot"
                        src={`/screenshots/${thread?.threadShortId}.png`}>
                    </img>}
                {!thread?.screenShotCreated
                    && <div className="thread__waiting-for-screenshot flex align-center justify-center">
                        <h2>Waiting for threadwatch bot🤖 to find screenshot...</h2>
                    </div>
                }
            </div>
            <div className="right flex flex-column">
                {commenters && commenters.map((commenter) => {
                    return <CommenterView commenter={commenter} />
                })}
            </div>
        </div>
        <div className="recent-threads flex flex-column">
            <h2>Recent</h2>
            <div className="recent-threads__content flex flex-wrap">
                {recentThreads && recentThreads.map((thread) => {
                    return <ThreadCard thread={thread} />
                })}
            </div>
        </div>
    </div>
}

export default Thread;