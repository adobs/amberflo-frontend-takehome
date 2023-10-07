import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Select, Input, Text, Button, useDisclosure, VStack, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { DeleteModal } from './DeleteModal';
import { INITIALLY_SEEDED_IDS } from '../utils';
import { Header } from './Header';
import { useCustomToast } from '../providers/ToastProvider';

type type = 'sum' | 'max' | 'unique_count';

interface Meter {
  id: string;
  api_name: string;
  display_name: string;
  active: boolean;
  used_for_billing: boolean;
  type: type;
}

export const MeterDetails = () => {
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_API_KEY;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useCustomToast();

  const [searchParams] = useSearchParams();
  const [updateable, setUpdateable] = useState<boolean>(false);

  const params = Object.fromEntries(searchParams.entries());
  const [meter, setMeter] = useState<Meter>({
    id: params.id,
    api_name: params.api_name,
    display_name: params.display_name,
    // all parameter values are a string, including booleans (eg `"true"` instead of `true`)
    active: params.active === 'true' ? true : false,
    used_for_billing: params.used_for_billing === 'true' ? true : false,
    type: params.type as type,
  });

  const compareInputs = () => {
    if (
      params.api_name === meter.api_name &&
      params.display_name === meter.display_name &&
      ((params.active === 'true' && meter.active) || (params.active === 'false' && !meter.active)) &&
      ((params.used_for_billing === 'true' && meter.used_for_billing) ||
        (params.used_for_billing === 'false' && !meter.used_for_billing)) &&
      params.type === meter.type
    ) {
      setUpdateable(false);
    } else {
      setUpdateable(true);
    }
  };

  useEffect(() => {
    compareInputs();
  }, [params, meter]);

  const onClickUpdate = () => {
    fetch(`https://take-home-exercise-api.herokuapp.com/meters/${meter.id}`, {
      method: 'PUT',
      headers: { 'API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(meter),
    })
      .then(() => {
        navigate('/');
        showToast(`Successfully updated "${meter.display_name}" meter`, 'success');
      })
      .catch(() => showToast(`Error updating "${meter.display_name}" meter`, 'error'));
  };

  const hstackFormatting = {
    spacing: 4,
    w: '100%',
    justifyContent: 'center',
  };

  const textFormatting = {
    whiteSpace: 'nowrap' as const,
    fontWeight: 'bold',
  };

  const isDisabled = INITIALLY_SEEDED_IDS.indexOf(meter.id) !== -1;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <Header isHomePage={false} />
      <VStack w="100%" pt={8}>
        <VStack
          w="400px"
          justifyItems="center"
          spacing={4}
          border="var(--chakra-colors-blue-500) 2px solid"
          p={4}
          borderRadius={8}
          boxShadow="3px 3px 3px lightgray"
        >
          <HStack {...hstackFormatting}>
            <Text {...textFormatting}>Display Name</Text>
            <Input
              isDisabled={isDisabled}
              value={meter.display_name}
              onChange={(e) => setMeter({ ...meter, display_name: e.target.value })}
            />
          </HStack>
          <HStack {...hstackFormatting}>
            <Text {...textFormatting}>API Name</Text>
            <Input
              isDisabled={isDisabled}
              value={meter.api_name}
              onChange={(e) => setMeter({ ...meter, api_name: e.target.value })}
            />
          </HStack>
          <HStack {...hstackFormatting}>
            <Text {...textFormatting}>Active</Text>
            <Select
              isDisabled={isDisabled}
              name="active"
              value={meter.active ? 'Yes' : 'No'}
              onChange={(e) => setMeter({ ...meter, active: e.target.value === 'Yes' ? true : false })}
            >
              <option>Yes</option>
              <option>No</option>
            </Select>
          </HStack>
          <HStack {...hstackFormatting}>
            <Text {...textFormatting}>Used for Billing</Text>
            <Select
              isDisabled={isDisabled}
              name="used_for_billing"
              value={meter.used_for_billing ? 'Yes' : 'No'}
              onChange={(e) => setMeter({ ...meter, used_for_billing: e.target.value === 'Yes' ? true : false })}
            >
              <option>Yes</option>
              <option>No</option>
            </Select>
          </HStack>
          <HStack {...hstackFormatting}>
            <Text {...textFormatting}>Type</Text>
            <Select
              isDisabled={isDisabled}
              name="type"
              value={meter.type}
              onChange={(e) => setMeter({ ...meter, type: e.target.value as type })}
            >
              <option value="max">Max</option>
              <option value="sum">Sum</option>
              <option value="unique_count">Unique count</option>
            </Select>
          </HStack>
          <HStack spacing={4}>
            <Button
              isDisabled={
                isDisabled ||
                !updateable ||
                !meter.api_name ||
                !meter.display_name ||
                meter.active === undefined ||
                meter.used_for_billing === undefined ||
                !meter.type
              }
              onClick={onClickUpdate}
              colorScheme="blue"
            >
              Update
            </Button>
            <Button
              onClick={onOpen}
              variant="outline"
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              isDisabled={isDisabled}
            >
              Delete
            </Button>
            <Button colorScheme="gray" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </HStack>
        </VStack>
        <DeleteModal
          isOpen={isOpen}
          onClose={onClose}
          afterDeleteFn={() => navigate('/')}
          display_name={meter.display_name}
          id={meter.id}
        />
      </VStack>
    </>
  );
};
