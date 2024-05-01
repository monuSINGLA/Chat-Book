import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import PostLoadingSkeleton from "../components/PostLoadingSkeleton.jsx";
import Post from "../components/Post.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom.js";

const UserPage = () => {
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  const {loading, user} = useGetUserProfile()
  

  useEffect(() => {
    const getPosts = async () => {
      if(!user) return
      setFetchingPosts(true);
      try {
        const response = await fetch(`/api/posts/user/${username}`);
        const data = await response.json();
  
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
  
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts()


  }, [username, showToast,user, setPosts]);

 

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) {
    return (
      <Flex justifyContent={"center"}>
        <h1>User not found</h1>
      </Flex>
    );
  }

  if (!user) return null;

  return (
    <>
      <UserHeader user={user} />

      {fetchingPosts && <PostLoadingSkeleton />}
      {!fetchingPosts && posts?.length === 0 && (
        <Text mt={10} fontSize={18} textAlign={"center"}>
          😣Oops Post not available!!
        </Text>
      )}

      {user &&
        !loading &&
        !fetchingPosts &&
        posts?.length > 0 &&
        posts?.map((post) => (
          <Post key={post?._id} post={post} postedBy={post?.postedBy} />
        ))}
    </>
  );
};

export default UserPage;
