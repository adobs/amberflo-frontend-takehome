import { useState, useEffect } from 'react';
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

import { useCustomToast } from '../providers/ToastProvider';

export const DeleteModal = ({ isOpen, onClose, display_name, id, afterDeleteFn }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const clearInput = () => setInputValue('');
  const onClickClose = () => {
    clearInput();
    onClose();
  };
  const { showToast } = useCustomToast();

  const apiKey = process.env.REACT_APP_API_KEY;

  const onClickDelete = () => {
    fetch(`https://take-home-exercise-api.herokuapp.com/meters/${id}`, {
      method: 'DELETE',
      headers: { 'API-KEY': apiKey },
    })
      .then(afterDeleteFn)
      .then(() => showToast(`Successfully deleted "${display_name}" meter`, 'success'))
      .catch(() => showToast(`Unable to delete "${display_name}" meter`, 'error'));
    clearInput();
    onClose();
  };

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && inputValue === 'DELETE') {
        onClickDelete();
      }
    };
    window.addEventListener('keydown', handleEnter);
    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, [onClickDelete]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete Meter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            To delete "{display_name}", type <b>DELETE</b> below
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          </ModalBody>

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
