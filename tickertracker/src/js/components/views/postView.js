import ReactMarkdown from 'react-markdown'
import Carousel from "nuka-carousel";
import numberFormatter from "js/utils/numberFormatter";
import React from "react";
import moment from 'moment';

const isRedditPreview = paragraph => {
  return paragraph.match(/http[s]?:\/\/preview.redd.it/g) && !paragraph.match(/\[.*\]\(.*\)/g);
}

const extractYTId = url => {
  // eslint-disable-next-line
  let ytreg = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
  return ytreg.exec(url)[1];
}

const ImageWCaption = props => (
  <div>
    <img alt={props.caption} src={props.url}/>
    <span>{props.caption}</span>
  </div>
)

const PostView = props => {

  let paragraphs = props.body.split(/\r?\n/);

  paragraphs = paragraphs.map((paragraph, i) => {
    if (isRedditPreview(paragraph)) {
      return <img alt="" className="inline-image" key={i} src={paragraph}/>
    } else {
      return <ReactMarkdown key={i}>{paragraph}</ReactMarkdown>;
    }
  })

  return (
    <div className="post" ref={props.lastElement}>
        <a href={props.redditlink} className = "originalLink" target="_blank" rel="noreferrer">
          <span className="infoSR">{props.subreddit}</span>
          <span className="info"> • {props.author} • {numberFormatter(props.score, 1, true)} points • {moment(props.date.toDate()).fromNow()}</span></a>
        <h2>{props.title}</h2>
        {paragraphs}
        {props.post_hint === "image" && <img alt="" className="inline-image" src={props.postedlink}/>}
        {props.post_hint === "link" && <a href={props.postedlink}>{props.postedlink}</a>}
        {props.post_hint === "hosted:video" && <video src={props.media.reddit_video.fallback_url} controls/>}
        {props.post_hint === "rich:video" && props.media?.oembed.provider_name === "YouTube" && 
        <div className="videoContainer"><iframe className="video" src={"https://www.youtube.com/embed/" + extractYTId(props.postedlink)} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div>
        }
        {props.is_gallery && <Carousel>
          {props.gallery_data.items.map(image => 
          <ImageWCaption 
            key={image.id} 
            url={props.media_metadata[image.media_id].s.u}
            caption={image.caption}
          />)}
        </Carousel>}
    </div>
  )
}

export default PostView
