import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  Button,
  Modal,
  ModalBody,
 
  ModalContent,
  ModalFooter,
 
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast.js";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import postsAtom from "../atoms/postsAtom.js";

const Post = ({ post, postedBy }) => {
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const[posts, setPosts] = useRecoilState(postsAtom)

  useEffect(() => {
    const getUser = async () => {

      try {
        const response = await fetch(`/api/users/profile/${postedBy}`);
        const data = await response.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        if(data.isFrozen) {
          setUser(null)
          return
        }
       

        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [showToast, postedBy, setUser]);


  // delete post 
  const handleDeletePost = async (e) => {
    e.preventDefault();

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${post?._id}`, {
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
      setPosts(posts.filter((prev)=>prev._id !== post?._id))
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  
  

  return (
    <>
      <Link to={user ? `/${user?.username}/post/${post?._id}` : "#"}>
        <Flex gap={3} py={5}>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
              size={"md"}
              name={user?.name}
              src={user?.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            />
            <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
            <Box position={"relative"} w={"full"}>
              {post.postReplies.length === 0 && (
                <Text textAlign={"center"}>😩</Text>
              )}

              {post?.postReplies[0] && (
                <Avatar
                  size={"xs"}
                  name={post?.postReplies[0].username}
                  src={post?.postReplies[0].userProfilePic}
                  position={"absolute"}
                  bottom={"0px"}
                  left={"4px"}
                  padding={"2px"}
                />
              )}

              {post.postReplies[1] && (
                <Avatar
                  size={"xs"}
                  name={post?.postReplies[1].username}
                  src={post?.postReplies[1].userProfilePic}
                  position={"absolute"}
                  bottom={"0px"}
                  right={"-5px"}
                  padding={"2px"}
                />
              )}

              {post.postReplies[2] && (
                <Avatar
                  size={"xs"}
                  name={post?.postReplies[2].username}
                  src={post?.postReplies[2].userProfilePic}
                  position={"absolute"}
                  top={"0px"}
                  left={"15px"}
                  padding={"2px"}
                />
              )}
            </Box>
          </Flex>

          <Flex flex={1} flexDirection={"column"} gap={2}>
            {user && (
              <Flex justifyContent={"space-between"} w={"full"}>
                <Flex alignItems={"center"} w={"full"}>
                  <Text
                    fontSize={"sm"}
                    fontWeight={"bold"}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${user?.username}`);
                    }}
                  >
                    {user?.username}
                  </Text>
                  <Image src="/verified.png" w={4} h={4} ml={1} />
                </Flex>

                <Flex alignItems={"center"} gap={4}>
                  <Text
                    fontSize={"xs"}
                    w={36}
                    textAlign={"right"}
                    color={"gray.light"}
                  >
                    {formatDistanceToNow(new Date(post?.createdAt))} ago
                  </Text>

                  {currentUser?._id === user?._id && (
                    <DeleteIcon
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
            )}

            <Text fontSize={"sm"}>{post?.postText}</Text>
            {post?.postImage && (
              <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={post?.postImage} w={"full"} />
              </Box>
            )}

            <Flex gap={3} my={1}>
              <Actions post={post} />
              
            </Flex>
          </Flex>
        </Flex>
      </Link>

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

export default Post;
