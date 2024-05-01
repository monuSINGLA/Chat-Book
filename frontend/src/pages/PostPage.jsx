import {
  Avatar,
  Flex,
  Image,
  Text,
  Box,
  Divider,
  Button,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";
import { formatDistanceToNow } from "date-fns";
import PostLoadingSkeleton from "../components/PostLoadingSkeleton";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom.js";
import {useNavigate} from 'react-router-dom'
import { v4 as uuidv4 } from "uuid";

const PostPage = () => {
  const [ posts, setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast();
  const { pid } = useParams();
  const { loading, user } = useGetUserProfile();
  const [isFethingPost, setIsFetchingPost] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useRecoilValue(userAtom)
  const [isDeleting, setIsDeleting] = useState(false);
  const currentPost = posts[0]
  const navigate = useNavigate()

  
  const randomKey = uuidv4();

  useEffect(() => {
    if (!user) return;

    const userPost = async () => {
      setPosts([])
      try {
        const resposne = await fetch(`/api/posts/${pid}`);
        const data = await resposne.json();

        if (data.error) {
          showToast("Error", data?.error, "error");
          return;
        }

        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts(null);
      } finally {
        setIsFetchingPost(false);
      }
    };
    userPost();
  }, [pid, showToast, setPosts, user]);

  const handleDeletePost = async (e) => {
    e.preventDefault();

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${currentPost?._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", data.message, "success");
      setPosts(posts.filter((prev)=>prev._id !== currentPost?._id))

      onClose();
      navigate(`/${user.username}`)
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!currentPost) return null;
  return (
    <>
      {isFethingPost && <PostLoadingSkeleton />}

      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.username}  cursor={"pointer"}/>

          <Flex alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"} cursor={"pointer"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} w={36} textAlign={"right"} color={"gray.light"}>
            {currentPost?.createdAt
              ? formatDistanceToNow(new Date(currentPost.createdAt)) + " ago"
              : "Unknown"}{" "}
          </Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon
              cursor={"pointer"}
              size={20}
              _hover={{ color: "red" }}
              onClick={(e) => {
                e.preventDefault();
                onOpen();
              }}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}> {currentPost?.postText} </Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={currentPost?.postImage} w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"} fontSize={{
            base:"13px",
            md:"lg",
            lg:"larger"
          }}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      {
        currentPost?.postReplies.map((reply) => {
          
          return (
            <Comment
              key={reply._id + randomKey}
              reply={reply}
              lastReply = {reply?._id === currentPost?.postReplies[currentPost?.postReplies.length - 1]._id}
            />
          );
        })}


      {/* post delete poppup */}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalBody>
            <Text>Delete post?</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={"10px"} size={"sm"} onClick={onClose}>
              No
            </Button>

            <Button
              bg={"red"}
              size={"sm"}
              onClick={handleDeletePost}
              isLoading={isDeleting}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostPage;
