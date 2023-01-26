import React from "react";
import PostView from "js/components/views/postView";
import loadingIcon from "assets/loading.svg";
import InfoPopup from "js/components/elements/infoPopup";
import { useTrendingPosts } from "js/hooks/useTrendingPosts";


const PostPresenter = props => {
  const [data, loading, error] = useTrendingPosts(props.symbols)
  const lastResult = React.useRef();
  const observer = React.useRef()
  const [shownPosts, setShownPosts] = React.useState([]);

  const [postAmnt, setPostAmnt] = React.useState(5);

  React.useEffect(() => {
    if (props.setLoading) {
      props.setLoading(loading)
    }
  }, [loading])

  const loadPosts = () => {
    if (observer.current) {
      observer.current.disconnect();
    }
    if (lastResult.current) {
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPostAmnt(prevAmnt => prevAmnt + 5)
        }
      });
      observer.current.observe(lastResult.current);
    }
  };

  React.useEffect(() => {
    setPostAmnt(5);
  }, [props.symbols])

  React.useEffect(() => {
    if (data) {
      setShownPosts(data.sort((a, b) => b.score - a.score).slice(0,postAmnt))
    } else {
      setShownPosts([]);
    }
  }, [data, postAmnt]);

  React.useEffect(() => {
    loadPosts();
  }, [shownPosts]);

  return (
    <>
    {!props.loading &&
    <>
      <span className="postHeader">
        <h1>{props.title}</h1>
        <InfoPopup content={<span>This content is user-provided and collected from today's 'Hot' posts on Reddit.</span>}/>
      </span>
      {error && <p className="error">An error occured. Please try again later.</p>}
      {loading && <div className="loading"><img alt="Loading..." src={loadingIcon}></img></div>}
      {data && shownPosts && shownPosts.map((post, index) => {
          return (
            <PostView 
              key={post.redditlink} 
              {...post} 
              fillView={loadPosts}
              lastElement={index == postAmnt-1 ? lastResult : null}
            />)
        })}
      <div className="end">
        {!loading && data && data.length <= shownPosts.length && <p>No more posts...</p>}
        {!loading && data.length > shownPosts.length && <img alt="Loading..." src={loadingIcon}></img>}
      </div>
    </>
    }
    </>)
}

export default PostPresenter
