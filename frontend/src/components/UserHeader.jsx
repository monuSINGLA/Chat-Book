import {
  Flex,
  Box,
  VStack,
  Avatar,
  Text,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useDisclosure,
  Button,
  Image,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";
import { useState } from "react";
import useFollowUnfollow from "../hooks/useFollowUnfollow.js";

const OverlayOne = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);

const UserHeader = ({ user }) => {
  const showToast = useShowToast();

  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const currentUser = useRecoilValue(userAtom);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const copyUrl = () => {
    const currentUrl = window.location.href;

    navigator.clipboard.writeText(currentUrl).then(() => {
      showToast("Profile link copied", "", "success");
    });
  };

  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} width={"full"}>
          <Box>
            <Text fontSize={"2xl"}>{user?.name}</Text>

            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user?.username}
              </Text>
              <Text
                fontSize={"xs"}
                bg={"gray.dark"}
                color={"gray.light"}
                p={1}
                borderRadius={"full"}
              >
                threds.next
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar
              onClick={() => {
                setOverlay(<OverlayOne />);
                onOpen();
              }}
              cursor={"pointer"}
              name={user?.name}
              src={
                user?.profilePic
                  ? user?.profilePic
                  : "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png"
              }
              size={{ base: "md", md: "xl" }}
            />
          </Box>
        </Flex>
        <Text>{user?.bio}</Text>
        {currentUser?._id === user._id && (
          <Link to="/update">
            <Button size={"sm"}>Update Profile</Button>
          </Link>
        )}
        {currentUser?._id !== user?._id && (
          <Button
            size={"sm"}
            bg={following ? "red" : "gray.light"}
            onClick={handleFollowUnfollow}
            isLoading={updating}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>{user?.followers.length} followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
          </Flex>
          <Flex>
            <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box>

            <Box className="icon-container">
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"dark"}>
                    <MenuItem bg={"dark"} onClick={copyUrl}>
                      Copy link
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>

        <Flex w={"full"}>
          <Flex
            flex={1}
            justifyContent={"center"}
            borderBottom={"1.5px solid white"}
            pb={3}
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Threads</Text>
          </Flex>

          {/* <Flex
            flex={1}
            justifyContent={"center"}
            borderBottom={"1px solid gray"}
            color={"gray.light"}
            pb={3}
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Replies</Text>
          </Flex> */}
        </Flex>
      </VStack>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent bg={"tranparent"}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={user?.profilePic} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserHeader;
