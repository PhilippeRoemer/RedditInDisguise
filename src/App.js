import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import OutlookMenuBar from "../src/images/OutlookMenuBar.jpg";
import waffleIcon from "../src/images/waffleIcon.png";
import searchIcon from "../src/images/searchIcon.png";
import profileImage from "../src/images/profileImage.png";
import emailButtons from "../src/images/emailButtons.png";
import emailFilter from "../src/images/emailFilter.jpg";
import foldersImage from "../src/images/foldersImage.png";
import redditLink from "../src/images/redditLink.png";

function App() {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [emailFetched, setEmailFetched] = useState(false);

    useEffect(() => {
        axios
            .get("https://www.reddit.com/r/worldnews/.json")
            .then((res) => {
                console.log(res.data.data.children);
                setPosts(res.data.data.children);
            })
            .catch((errors) => {
                console.error(errors);
            });
    }, []);

    const fetchPost = (e) => {
        setEmailFetched(true);
        /* Selects the Reddit post ID */
        const redditPostID = e.currentTarget.id;
        console.log(redditPostID);

        const xy = document.getElementById(redditPostID).dataset.url;
        console.log(xy);

        /* Creates a link to comment JSON data */
        const permaLink = document.getElementById(redditPostID).dataset.permalink;
        console.log("https://www.reddit.com" + permaLink + ".json");

        /* Displays Reddit post title */
        const postTitle = document.getElementById(redditPostID).dataset.title;
        document.getElementById("displayPostTitle").innerHTML = postTitle;

        /* Displays Reddit post author */
        const postAuthor = document.getElementById(redditPostID).dataset.author;
        document.getElementById("author").innerHTML = postAuthor;

        /* Displays Reddit post subreddit */
        const postSubReddit = document.getElementById(redditPostID).dataset.subreddit;
        document.getElementById("subReddit").innerHTML = postSubReddit;

        /* Displays Reddit post thumbnail */
        const postThumbnail = document.getElementById(redditPostID).dataset.thumbnail;

        if (postThumbnail.startsWith("https")) {
            document.getElementById("thumbnail").src = postThumbnail;
        } else {
            document.getElementById("thumbnail").src = redditLink;
        }

        /* Displays Reddit post selftext */
        const postSelfText = document.getElementById(redditPostID).dataset.selftext;
        document.getElementById("selftext").innerHTML = postSelfText;

        /* Displays Reddit post URL */
        const postURL = document.getElementById(redditPostID).dataset.url;
        document.getElementById("url").href = postURL;

        /* Displays Reddit post created date and Time */
        const postCreatedTime = document.getElementById(redditPostID).dataset.created;
        document.getElementById("created").innerHTML = postCreatedTime;

        axios
            .get("https://www.reddit.com" + permaLink + ".json")
            .then((res) => {
                console.log(res.data[1].data.children);
                setComments(res.data[1].data.children);
                console.log("Post Top Comment: " + res.data[1].data.children[0].data.body);
                console.log("Comment Reply: " + res.data[1].data.children[0].data.replies.data.children[0].data.body);
            })
            .catch((errors) => {
                console.error(errors);
            });

        console.log("Testing");
    };

    return (
        <div className="App">
            <div className="header">
                <div className="homeSection">
                    <img src={waffleIcon} className="waffleIcon" />
                    <h3 className="outlookIcon">Outlook</h3>
                    <div className="searchbarContainer">
                        <input type="text" placeholder="Search" className="searchbar" />
                        <img src={searchIcon} className="searchIcon" />
                    </div>
                </div>
                <div>
                    <img src={OutlookMenuBar} className="outlookMenuIcons" />
                    <img src={profileImage} className="profileImage" />
                </div>
            </div>
            <div class="emailCommandToolbar">
                <img src={emailButtons} />
            </div>

            <div class="emailContainer">
                <div class="emailFolders">
                    <img src={foldersImage} />
                </div>
                <div class="emails">
                    <img src={emailFilter} />

                    {/* Listed Posts */}
                    {posts.map((post) => {
                        const title = post.data.title;
                        const id = post.data.id;
                        const url = post.data.url;
                        const permalink = post.data.permalink;
                        const author = post.data.author;
                        const subReddit = post.data.subreddit_name_prefixed;
                        const thumbnail = post.data.thumbnail;
                        const selfText = post.data.selftext;
                        const epochTime = new Date(post.data.created * 1000);

                        const created = epochTime.toLocaleTimeString("en-US", { weekday: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: true });

                        const truncateTitle = title.substring(0, 45) + "...";
                        return (
                            <div onClick={fetchPost} id={id} data-url={url} data-permalink={permalink} data-title={title} data-author={author} data-subreddit={subReddit} data-thumbnail={thumbnail} data-created={created} data-selftext={selfText} className="email">
                                <p className="emailTitle">{truncateTitle}</p>
                                <p>{author}</p>
                                <p className="emailSubreddit">{subReddit}</p>
                            </div>
                        );
                    })}
                </div>

                <div class="selectedEmail" id="post">
                    <div className={emailFetched === true ? "showDiv" : "hideDiv"}>
                        <p class="selectedEmail_Title" id="displayPostTitle"></p>
                        <div class="selectedEmail_Body">
                            <div className="selectedEmail_Info">
                                <div>
                                    <a href="" id="url" target="_blank">
                                        <img src="" id="thumbnail" className="selectedEmail_Thumbnail" />
                                    </a>
                                </div>
                                <div>
                                    <p id="author"></p>
                                    <p id="created" className="emailDate"></p>
                                    <p>
                                        To: <span id="subReddit"></span>
                                    </p>
                                </div>
                            </div>

                            <p id="selftext"></p>

                            {comments.map((post) => {
                                const redditPostComments = post.data.body;

                                return (
                                    <ul>
                                        <li>{redditPostComments}</li>
                                    </ul>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
