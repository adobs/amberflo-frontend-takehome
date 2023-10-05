import { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Button, Input, Select, useDisclosure } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { DeleteModal } from './DeleteModal';

interface meter {
  id: string;
  api_name: string;
  display_name: string;
  active: boolean;
  used_for_billing: boolean;
  type: 'sum' | 'max' | 'unique_count';
  updated_time: string;
  created_time: string;
}

export const Home = () => {
  const apiKey = '112006f223408a72170f5c65e835b9f0031e030871e540be065af91ab47c9973';
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [meters, setMeters] = useState<meter[]>([]);
  const [deleteMeter, setDeleteMeter] = useState<{ displayName: string; id: string }>({ displayName: '', id: '' });
  const blankMeter = {
    apiName: '',
    displayName: '',
    active: undefined,
    usedForBilling: undefined,
    type: undefined,
  };
  const [newMeter, setNewMeter] = useState<{
    apiName: string;
    displayName: string;
    active: string | undefined;
    usedForBilling: string | undefined;
    type: string | undefined;
  }>(blankMeter);
  const [showInputRow, setShowInputRow] = useState<boolean>(false);

  const fetchMeters = () =>
    fetch('https://take-home-exercise-api.herokuapp.com/meters', { headers: { 'API-KEY': apiKey } })
      .then((response) => response.json())
      .then((data) => {
        setMeters(data);
      });

  const deleteFn = (id) => {
    fetch(`https://take-home-exercise-api.herokuapp.com/meters/${id}`, {
      method: 'DELETE',
      headers: { 'API-KEY': apiKey },
    })
      .then(fetchMeters)
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    // add catch
    fetchMeters();
  }, []);

  useEffect(() => {
    if (deleteMeter.displayName) {
      console.log('deletedisplayname', deleteMeter.displayName);
      onOpen();
    }
  }, [deleteMeter.displayName]);

  const onClickDelete = (id: string, displayName: string) => {
    setDeleteMeter({ displayName, id });
  };

  const onClickAdd = () => {
    // add catch
    const data = {
      api_name: newMeter.apiName,
      display_name: newMeter.displayName,
      active: newMeter.displayName === 'Yes' ? true : false,
      used_for_billing: newMeter.usedForBilling === 'Yes' ? true : false,
      type: newMeter.type.replace(' ', '_').toLowerCase(),
    };
    fetch('https://take-home-exercise-api.herokuapp.com/meters', {
      method: 'POST',
      headers: { 'API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(() => {
        fetchMeters();
        setNewMeter(blankMeter);
        setShowInputRow(false);
      })
      .catch((error) => console.log('error', error));
  };

  // make rows clickable, but not if is an initial meter
  const columns = useMemo(
    () => [
      {
        Header: 'API Name',
        accessor: 'api_name',
      },
      {
        Header: 'Display Name',
        accessor: 'display_name',
      },
      {
        Header: 'Active',
        accessor: 'active',
        Cell: (value) => (value.value ? 'Yes' : 'No'),
      },
      {
        Header: 'Used for Billing',
        accessor: 'used_for_billing',
        Cell: (value) => (value.value ? 'Yes' : 'No'),
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: (value) => {
          const formattedValue = value.value.replace('_', ' ');
          return formattedValue[0].toUpperCase() + formattedValue.slice(1);
        },
      },
      {
        accessor: 'action',
        Cell: (value) => (
          <Button onClick={() => onClickDelete(value.row.original.id, value.row.original.display_name)}>Delete</Button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, rows, prepareRow, headers } = useTable(
    {
      columns,
      data: meters,
    },
    useSortBy
  );

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          <tr>
            {headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')} <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
          {showInputRow && (
            <tr>
              <td>
                <Input
                  isRequired
                  name="api_name"
                  placeholder="API Name"
                  value={newMeter.apiName}
                  onChange={(e) => setNewMeter({ ...newMeter, apiName: e.target.value })}
                />
              </td>
              <td>
                <Input
                  name="display_name"
                  placeholder="Display Name"
                  value={newMeter.displayName}
                  onChange={(e) => setNewMeter({ ...newMeter, displayName: e.target.value })}
                />
              </td>
              <td>
                <Select
                  name="active"
                  placeholder='Select "Active"'
                  value={newMeter.active}
                  onChange={(e) => setNewMeter({ ...newMeter, active: e.target.value })}
                >
                  <option>Yes</option>
                  <option>No</option>
                </Select>
              </td>
              <td>
                <Select
                  name="used_for_billing"
                  placeholder='Select "Used for Billing"'
                  value={newMeter.usedForBilling}
                  onChange={(e) => setNewMeter({ ...newMeter, usedForBilling: e.target.value })}
                >
                  <option>Yes</option>
                  <option>No</option>
                </Select>
              </td>
              <td>
                <Select
                  isRequired
                  name="type"
                  placeholder='Select "Type"'
                  value={newMeter.type}
                  onChange={(e) => setNewMeter({ ...newMeter, type: e.target.value })}
                >
                  <option>Max</option>
                  <option>Sum</option>
                  <option>Unique count</option>
                </Select>
              </td>
              <td>
                <Button
                  isDisabled={
                    !newMeter.apiName ||
                    !newMeter.displayName ||
                    !newMeter.active ||
                    !newMeter.usedForBilling ||
                    !newMeter.type
                  }
                  onClick={onClickAdd}
                >
                  Add
                </Button>
                <Button onClick={() => setShowInputRow(false)}>Cancel</Button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!showInputRow && (
        <Button onClick={() => setShowInputRow(true)} leftIcon={<PlusSquareIcon />}>
          Add meter
        </Button>
      )}
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        displayName={deleteMeter.displayName}
        id={deleteMeter.id}
        deleteFn={deleteFn}
      />
    </>
  );
};
