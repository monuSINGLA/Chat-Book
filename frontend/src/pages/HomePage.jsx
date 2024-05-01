import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import useShowToast from "../hooks/useShowToast.js";
import Post from "../components/Post.jsx";
import PostLoadingSkeleton from "../components/PostLoadingSkeleton.jsx";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom.js";
import SuggestedUsers from "../components/SuggestedUsers.jsx";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    const getFeedPosts = async () => {
      try {
        const response = await fetch(`/api/posts/feed`);
        const data = await response.json();
        if (data.error) {
          if(data.length){

            showToast("Error", data.error, "error");
          }
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems={"flex-start"}>
        {loading && (
          
          <Flex flexDirection={"column"} w={"full"}>
            <PostLoadingSkeleton />
            <PostLoadingSkeleton />
            <PostLoadingSkeleton />
            </Flex>
          
        )}

      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <Flex justifyContent={"center"}>
            <h1>Follow users to see the feeds</h1>
          </Flex>
        )}

        {!loading && posts.length > 0 && (
          <Flex direction={"column"} gap={6}>
            {posts.map((post) => (
              <Post key={post?._id} post={post} postedBy={post.postedBy} />
            ))}
          </Flex>
        )}
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
