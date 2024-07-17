import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import Masonry from "react-masonry-css";
import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from "@mui/material";
import InfiniteScroll from 'react-infinite-scroll-component';


const useStyles = makeStyles((theme) => ({
  myMasonryGrid: {
    display: "flex",
    marginLeft: "0rem",
    width: "auto",
  },
  myMasonryGridColumn: {
    paddingLeft: "1rem",
    backgroundClip: "padding-box",
  },
  masonryItem: {
    marginBottom: "0rem",
  },
}));

const PostsWidget = ({ userId, isProfile = false }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const getPosts = async (page) => {
    const response = await fetch(`http://localhost:3001/posts?page=${page}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts:data }));
  };

  const getUserPosts = async (page) => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts?page=${page}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));

  };

  useEffect(() => {
    const fetchInitialPosts = async () => {
      if (isProfile) {
        await getUserPosts(1);
      } else {
        await getPosts(1);
      }
    };
    fetchInitialPosts();
  }, []);

  const fetchMorePosts = async () => {

    try {
      if (isProfile) {
        await getUserPosts(currentPage);
      } else {
        await getPosts(currentPage);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
      // Handle error gracefully (e.g., display error message, offer retry)
    }
  };

  const classes = useStyles();



  const breakpoints = {
    default: isProfile ? 1 : 4,
    1100: isProfile ? 1 : 3,
    700: isProfile ? 1 : 2,
    500: isProfile ? 1 : 1,
  };
  
  const moblieBreakpoints = {
    default: isProfile ? 1 : 2,
    100: isProfile ? 1 : 3,
    50: isProfile ? 1 : 2,
  };
  

  return (
    <InfiniteScroll
      dataLength={posts.length} // Adjust for Masonry compatibility
      next={fetchMorePosts}
      hasMore={hasMorePosts}
      loader={""}
      endMessage={<p>No more posts to display</p>}

  >
    <Masonry
      breakpointCols={isNonMobileScreens ? breakpoints : moblieBreakpoints}
      className={classes.myMasonryGrid}
      columnClassName={classes.myMasonryGridColumn}
    >
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className={classes.masonryItem}>
            <PostWidget
              postId={post._id}
              postUserId={post.userId}
              name={`${post.firstName} ${post.lastName}`}
              description={post.description}
              location={post.location}
              picturePath={post.picturePath}
              thumbnailPicturePath={post.thumbnailPicturePath}
              userPicturePath={post.userPicturePath}
              likes={post.likes}
              comments={post.comments}
            />
          </div>
        ))
      ) : (
        <div className={classes.masonryItem}>
          <p>No posts to display.</p>
        </div>
      )}
    </Masonry>
    </InfiniteScroll>
  );
};

export default PostsWidget;
