import { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from '@chakra-ui/react';

export const DeleteModal = ({ isOpen, onClose, displayName, id, deleteFn }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const clearInput = () => setInputValue('');
  const onClickClose = () => {
    clearInput();
    onClose();
  };
  const onClickDelete = () => {
    deleteFn(id);
    clearInput();
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion of "{displayName}" Meter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>To delete "{displayName}", type DELETE below:</ModalBody>
          <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClickClose}>
              Close
            </Button>
            <Button isDisabled={inputValue !== 'DELETE'} onClick={onClickDelete} colorScheme="red">
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
