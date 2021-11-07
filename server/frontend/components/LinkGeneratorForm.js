import { useState } from "react";
import "../styles/link-generator-form.scss";

function LinkGeneratorForm() {
    const [errorText, setErrorText] = useState(null);
    const [postLink, setPostLink] = useState("");
    const [threadLink, setThreadLink] = useState(null);

    const validURL = (str) => {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

    const createThread = async () => {
        setErrorText(null);
        if (!validURL(postLink)) {
            setErrorText("Please enter a valid url")
            return;
        }
        const rawResponse = await fetch('/api/thread', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postLink })
        });
        const content = await rawResponse.json();

        if (!content.threadShortId) {
            setErrorText(content.message);
            return;
        }

        const newThreadLink = `${window.location.origin}/t/${content.threadShortId}`;
        setThreadLink(newThreadLink);
    }

    return <div className="link-generator-form flex">
        {!threadLink && <div className="flex flex-column">
            <label className="input-label">Enter your post link <span className="error-text">(only works for Twitter currently)</span></label>
            <span className="hint-text">* example: https://twitter.com/TimeOutLondon/status/1455873444109852680</span>
            <span className="hint-text">* post within a MINUTE of when you generate the link</span>
            <input
                type="text"
                className="link-generator-form__text"
                placeholder="Post link"
                value={postLink}
                onChange={(e) => setPostLink(e.target.value)} />
            <button className="tw-btn primary link-generator-form__button" onClick={(e) => createThread()}>Generate Link</button>
            {errorText && <span className="error-text">{errorText}</span>}
        </div>}
        {threadLink && <div className="flex flex-column">
            <label className="input-label">Link Generated! Copy and paste in your thread</label>
            <input type="text" readOnly={true} className="link-generator-form__text" value={threadLink} />
        </div>}

    </div>
}

export default LinkGeneratorForm;