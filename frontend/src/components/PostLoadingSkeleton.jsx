import {
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

const PostLoadingSkeleton = () => {
  return (
    <>
      <Box mb={10} mt={3}  boxShadow="lg" position={"relative"}>
        <Flex
          h={"95%"}
          flexDirection={"column"}
          alignItems={"center"}
          position={"absolute"}
          top={55}
          left={13}
        >
          <Skeleton h={"100%"} w={0.5} />
          <SkeletonCircle ml={0} size={"18"} />
        </Flex>
        <Flex alignItems={"center"} w={"100%"}>
          <SkeletonCircle size="45" />
          <Flex flexDirection={"column"} ml={2} gap={2} mt={5}>
            <Skeleton h={4} w={40} />
            <Skeleton h={2}  />
          </Flex>
        </Flex>

        <Skeleton ml={10} mt={4} height="350px" rounded={"lg"} />
        <Flex ml={50} flexDirection={"column"} gap={2}>
          <Flex mt={6} gap={2}>
            <SkeletonCircle size="25" />
            <SkeletonCircle size="25" />
            <SkeletonCircle size="25" />
            <SkeletonCircle size="25" />
          </Flex>
          <Flex alignItems={"center"} gap={2} ml={1}>
            <Skeleton h={4} w={12}></Skeleton>
            <SkeletonCircle w={2} h={2} />
            <Skeleton h={4} w={12}></Skeleton>
          </Flex>
        </Flex>
      </Box>
      {/* <Box padding="6" boxShadow="lg">
        <Flex justifyContent={"space-between"}>
          <SkeletonCircle size="45" />
        </Flex>
        <Skeleton ml={10}>
          <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="2" />
          <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="2" />
          <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="2" />
        </Skeleton>

        <Skeleton ml={10} mt={6} height="300px" />
        <Flex ml={10} mt={6} gap={2}>
          <SkeletonCircle size="25" />
          <SkeletonCircle size="25" />
          <SkeletonCircle size="25" />
          <SkeletonCircle size="25" />
        </Flex>
      </Box>
      <Box padding="6" boxShadow="lg">
        <Flex justifyContent={"space-between"}>
          <SkeletonCircle size="45" />
        </Flex>
        <Skeleton ml={10}>
          <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="2" />
          <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="2" />
          <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="2" />
        </Skeleton>

        <Skeleton ml={10} mt={6} height="300px" />
        <Flex ml={10} mt={6} gap={2}>
          <SkeletonCircle size="25" />
          <SkeletonCircle size="25" />
          <SkeletonCircle size="25" />
          <SkeletonCircle size="25" />
        </Flex>
      </Box> */}
    </>
  );
};

export default PostLoadingSkeleton;
