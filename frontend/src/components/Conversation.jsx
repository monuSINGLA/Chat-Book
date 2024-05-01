import {
  Flex,
  WrapItem,
  Avatar,
  AvatarBadge,
  Stack,
  Text,
  Image,
  useColorModeValue,
  useColorMode,
  Box
} from "@chakra-ui/react";
import userAtom from "../atoms/userAtom.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/conversationsAtom.js";

const Conversation = ({ conversation, isOnline }) => {
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  

  const username = conversation?.participants[0]?.username;
  const profilePic = conversation?.participants[0]?.profilePic;
  const lastMessage = conversation?.lastMessage?.text;
  const colorMode = useColorMode();

  const isCurrentuser = conversation?.lastMessage?.sender === currentUser?._id;
 


  return (
    <Flex
      mt={1}
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.dark", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() =>
        setSelectedConversation({
          _id: conversation?._id,
          otherUserId: conversation?.participants[0]?._id,
          username,
          userProfilePic: profilePic,
          mock : conversation?.mock
        })
      }
      bg={
        selectedConversation?._id === conversation?._id
          ? colorMode === "light"
            ? "gray.600"
            : "gray.dark"
          : ""
      }
      color={
        selectedConversation?._id === conversation?._id
          ? colorMode === "light"
            ? "white"
            : "white"
          : ""
      }
      display={{
        base: selectedConversation?._id? "none" : "flex",
        md: "flex"
      }}
    >
      <WrapItem>
        <Avatar
          name={username}
          size={{
            base: "sm",
            md: "md",
          }}
          src={profilePic}
        >
          {isOnline ? <AvatarBadge boxSize={"1em"} bg="lime" /> : ""}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"} gap={1}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"}>
          {username} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Flex fontSize={"sm"} display={"flex"} alignItems={"center"} gap={1}>
          {isCurrentuser ? (
            <Box color={conversation?.lastMessage?.seen ? "blue.400" : "#ffffff"}>
              <BsCheck2All size={16}  />
            </Box>
          ):("") }

          {lastMessage?.length > 18
            ? isCurrentuser
              ? lastMessage?.substring(0, 15) + "..."
              : lastMessage?.substring(0, 18) + "..."
            : lastMessage  ? lastMessage :conversation.mock? "Start chatting..." : <BsFillImageFill size={16} />}
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Conversation;
