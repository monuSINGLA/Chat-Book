import { Avatar, Flex, Image, Link, useColorMode,Button } from "@chakra-ui/react";
import React from "react";
import dark from "/dark-logo.svg";
import light from "/light-logo.svg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { AiFillHome } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";
import { MdLogout, MdOutlineSettings } from "react-icons/md";
import useLogout from "../hooks/useLogout.js";
import { BsFillChatQuoteFill } from "react-icons/bs";


const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout()

  return (
    <Flex justifyContent={user ? "space-between" : "center"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to={"/"}>
          <AiFillHome size={24} />
        </Link>
      )}
      <Image
        cursor={"pointer"}
        width={6}
        alt="logo"
        src={colorMode === "dark" ? light : dark}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <Avatar
              src={user.profilePic}
              title={`${user.username} profile`}
              size={"sm"}
            />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
           <BsFillChatQuoteFill size={20} />
          </Link>
          <Link as={RouterLink} to={`/settings`}>
           <MdOutlineSettings size={20} />
          </Link>
          <Button size={{base: "xs", md:"sm"}} onClick={logout}>
            <MdLogout size={"20px"} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
