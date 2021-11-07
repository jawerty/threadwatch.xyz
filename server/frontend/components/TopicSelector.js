import { useEffect, useState } from "react";

import "../styles/topic-selector.scss";

function TopicSelector({ selectedTopicFilter, topicSelectorHandler }) {
    const [topics, setTopics] = useState([]);

    useEffect(async () => {
        const rawResponse = await fetch(`/api/topic?sort=freq`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const content = await rawResponse.json();
        setTopics(content.topics);
    }, []);

    return <div className="topic-selector flex">
        <div

            onClick={(e) => topicSelectorHandler(true)} // true is used for all (non string)
            className={`topic-bubble${selectedTopicFilter === true ? " selected" : ""}`}>
            all topics
        </div>
        {topics && topics.map((topic) => {
            return <div
                onClick={(e) => topicSelectorHandler(topic.name)}
                className={`topic-bubble${selectedTopicFilter === topic.name ? " selected" : ""}`}>
                {topic.name}
            </div>
        })}
    </div>
}

export default TopicSelector;