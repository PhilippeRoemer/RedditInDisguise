import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    /* On page load - Reddit data fetched */
    useEffect(() => {
        axios
            .get("https://www.reddit.com/.json")
            .then((res) => {
                console.log(res.data.data.children);
                setPosts(res.data.data.children);
            })
            .catch((errors) => {
                console.error(errors);
            });
    }, []);

    const fetchPost = (e) => {
        /* On post title clicked - Selects the Reddit post ID */
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
            <h1>testing</h1>
            {/* Listed Posts */}
            {posts.map((post) => {
                const title = post.data.title;
                const id = post.data.id;
                const url = post.data.url;
                const permalink = post.data.permalink;
                const author = post.data.author;
                const subReddit = post.data.subreddit_name_prefixed;
                const thumbnail = post.data.thumbnail;

                return (
                    <div onClick={fetchPost} id={id} data-url={url} data-permalink={permalink} data-title={title} data-author={author} data-subreddit={subReddit} data-thumbnail={thumbnail}>
                        <p>{title}</p>
                    </div>
                );
            })}
            {/* Selected Post */}
            <h1 id="displayPostTitle"></h1>
            <h2 id="subReddit"></h2>
            <h3 id="author"></h3>

            {/* Selected Post Comments */}
            {comments.map((post) => {
                const redditPostComments = post.data.body;

                return (
                    <ul>
                        <li>{redditPostComments}</li>
                    </ul>
                );
            })}
        </div>
    );
}

export default App;
