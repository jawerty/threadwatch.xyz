import { useState } from "react";

import "../styles/front-page.scss";

import LinkGeneratorForm from "./LinkGeneratorForm";
import ThreadList from "./ThreadList";
import TopicSelector from "./TopicSelector";

function FrontPage() {
	const [topicFilter, setTopicFilter] = useState(true);
	const [showLinkForm, setShowLinkForm] = useState(false);

	return <div className="front-page">
		<div className="front-page__intro-header flex flex-row">
			<div className="front-page__intro-header__title flex align-center justify-center">
				{!showLinkForm && <div className="flex flex-column">
					<h1 className="title__text">threadwatch.xyz</h1>
					<span className="title__subtitle-text">The Internet's Comment Watchdog</span>
					<button className="tw-btn primary mt-2" onClick={(e) => setShowLinkForm(true)}>Get a threadwatch link</button>
				</div>}
				{showLinkForm && <div className="flex flex-column">
					<h2 className="title__text">threadwatch.xyz</h2>
					<LinkGeneratorForm />
				</div>}
			</div>
			<div className="front-page__intro-header__info flex flex-column align-center justify-center">
				<div className="flex flex-column">
					<p>1) Get into an argument on the Internet</p>
					<p>2) Grab a threadwatch.xyz link</p>
					<p>3) Post the link in the thread (under the comment you want to highlight)</p>
					<p>4) See what happens!</p>
				</div>
			</div>
		</div>
		<div className="front-page__content">
			<TopicSelector selectedTopicFilter={topicFilter} topicSelectorHandler={setTopicFilter.bind(this)} />
			<ThreadList topicFilter={topicFilter} />
		</div>


	</div>
}

export default FrontPage;