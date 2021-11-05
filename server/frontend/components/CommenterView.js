import ReactionVoter from "./ReactionVoter";

import "../styles/commenter-view.scss";

function CommenterView({ commenter }) {
    console.log(commenter);
    const getTwitterHandler = () => {
        // do if twitter
        return commenter.name.substring(commenter.name.indexOf("@")).trim();
    }

    const pruneComment = (comment) => {
        const words = comment.split(' ');
        const intsToRemove = [];
        console.log(words)
        const weirdInts = words[words.length - 1].split('\n')
        for (let i = 0; i < weirdInts.length; i++) {
            if (parseInt(weirdInts[i]) < 10) {
                intsToRemove.push(parseInt(weirdInts[i]));
            }
        }
        console.log(intsToRemove)
        if (intsToRemove.length > 0) {
            comment = comment.substring(0, comment.length - intsToRemove.join(' ').length);
        }
        if (comment.indexOf('\n·\n') > -1) {
            return comment.substring(comment.indexOf('\n·\n') + 3);
        } else {
            return comment;
        }
    }

    return <div className="commenter-view flex flex-column">
        <a
            target="_blank"
            className="commenter-view__commenter-name"
            href={`https://twitter.com/${getTwitterHandler()}`}>
            {commenter.name}
        </a>
        <p>{pruneComment(commenter.comment)}</p>
        <div className="flex flex-row">
            <ReactionVoter
                type="hearts"
                initCount={commenter.hearts}
                commenterId={commenter._id}
            />
            <ReactionVoter
                type="angrys"
                initCount={commenter.angrys}
                commenterId={commenter._id}
            />
            <ReactionVoter
                type="laughs"
                initCount={commenter.laughs}
                commenterId={commenter._id}
            />
            <ReactionVoter
                type="rockets"
                initCount={commenter.rockets}
                commenterId={commenter._id}
            />
        </div>
    </div>
}

export default CommenterView;