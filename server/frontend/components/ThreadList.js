import { useState, useEffect } from "react";

import "../styles/thread-list.scss";

import ThreadCard from "./ThreadCard";

function ThreadList({ topicFilter, recent = false }) {
    const [threads, setThreads] = useState([]);

    useEffect(async () => {
        let topicFilterQuery = "";
        let recentQuery = "";
        if (topicFilter !== true) {
            topicFilterQuery = (topicFilter) ? `&topicFilter=${topicFilter}` : "";
        }
        if (recent) {
            recentQuery = (recent) ? `&timeFilter=recent` : "";
        }

        const rawResponse = await fetch(`/api/thread?found=true${topicFilterQuery}${recentQuery}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const content = await rawResponse.json();
        setThreads(content.threads)
    }, [topicFilter]);

    return <div className="thread-list flex">
        {threads && threads.map((thread) => {
            return <ThreadCard thread={thread} />;
        })}
    </div>
}

export default ThreadList;