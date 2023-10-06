import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Select, Input, Text, Button, useDisclosure } from '@chakra-ui/react';

import { DeleteModal } from './DeleteModal';

type type = 'sum' | 'max' | 'unique_count';

interface Meter {
  id: string;
  api_name: string;
  display_name: string;
  active: boolean;
  used_for_billing: boolean;
  type: type;
}
const apiKey = '112006f223408a72170f5c65e835b9f0031e030871e540be065af91ab47c9973';

export const MeterDetails = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchParams] = useSearchParams();

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

  const onClickUpdate = () => {
    fetch(`https://take-home-exercise-api.herokuapp.com/meters/${meter.id}`, {
      method: 'PUT',
      headers: { 'API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(meter),
    })
      // TODO fix below; what to do in error state
      .then(() => navigate('/'))
      .catch((error) => console.log('error', error));
  };

  return (
    <>
      <Text>Edit Details for "{meter.display_name}" Meter </Text>
      <Text>Display Name:</Text>
      <Input
        value={meter.display_name}
        onChange={(e) => setMeter({ ...meter, display_name: e.target.value })}
        placeholder={meter.display_name}
      />
      <Text>API Name:</Text>
      <Input
        value={meter.api_name}
        onChange={(e) => setMeter({ ...meter, api_name: e.target.value })}
        placeholder={meter.api_name}
      />
      <Text>Active:</Text>
      <Select
        name="active"
        placeholder='Select "Active"'
        value={meter.active ? 'Yes' : 'No'}
        onChange={(e) => setMeter({ ...meter, active: e.target.value === 'Yes' ? true : false })}
      >
        <option>Yes</option>
        <option>No</option>
      </Select>
      <Text>Used for Billing:</Text>
      <Select
        name="used_for_billing"
        placeholder='Select "Used for Billing"'
        value={meter.used_for_billing ? 'Yes' : 'No'}
        onChange={(e) => setMeter({ ...meter, used_for_billing: e.target.value === 'Yes' ? true : false })}
      >
        <option>Yes</option>
        <option>No</option>
      </Select>
      <Select
        isRequired
        name="type"
        placeholder='Select "Type"'
        value={meter.type}
        onChange={(e) => setMeter({ ...meter, type: e.target.value as type })}
      >
        <option value="max">Max</option>
        <option value="sum">Sum</option>
        <option value="unique_count">Unique count</option>
      </Select>
      <Button
        isDisabled={
          !meter.api_name ||
          !meter.display_name ||
          meter.active === undefined ||
          meter.used_for_billing === undefined ||
          !meter.type
        }
        onClick={onClickUpdate}
      >
        Update
      </Button>
      <Button
        onClick={() => {
          onOpen();
        }}
      >
        Delete
      </Button>

      <DeleteModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          navigate('/');
        }}
        display_name={meter.display_name}
        id={meter.id}
      />
    </>
  );
};
