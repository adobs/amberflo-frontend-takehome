import { HStack, Heading, Link } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

export const Header = ({ isHomePage }: { isHomePage: boolean }) => (
  <HStack pt={8} pl={4} pb={4}>
    <Heading>
      <Link href="/">Amberflo Home</Link>
    </Heading>
    {!isHomePage && (
      <>
        <ChevronRightIcon boxSize="40px" />
        <Heading>Edit Meter Details</Heading>
      </>
    )}
  </HStack>
);
