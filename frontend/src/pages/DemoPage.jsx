import { Flex } from "@chakra-ui/react";
import React from "react";

const DemoPage = () => {
  return (
    <>
      <Flex flexDirection={"column"}>
        <video src="/demo.mp4" controls />
      </Flex>
    </>
  );
};

export default DemoPage;
