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
const apiKey = '112006f223408a72170f5c65e835b9f0031e030871e540be065af91ab47c9973';

export const DeleteModal = ({ isOpen, onClose, display_name, id }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const clearInput = () => setInputValue('');
  const onClickClose = () => {
    clearInput();
    onClose();
  };
  const onClickDelete = () => {
    fetch(`https://take-home-exercise-api.herokuapp.com/meters/${id}`, {
      method: 'DELETE',
      headers: { 'API-KEY': apiKey },
    })
      // .then(fetchMeters)
      .catch((error) => console.log('error', error));
    clearInput();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion of "{display_name}" Meter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>To delete "{display_name}", type DELETE below:</ModalBody>
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
