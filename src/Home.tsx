import { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { Button, Input, Select, useDisclosure } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { DeleteModal } from './DeleteModal';
import { useNavigate, createSearchParams } from 'react-router-dom';

interface Meter {
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
  const navigate = useNavigate();

  const [meters, setMeters] = useState<Meter[]>([]);
  const [deleteMeter, setDeleteMeter] = useState<{ display_name: string; id: string }>({ display_name: '', id: '' });
  const blankMeter = {
    api_name: '',
    display_name: '',
    active: undefined,
    used_for_billing: undefined,
    type: undefined,
  };
  const [newMeter, setNewMeter] = useState<{
    api_name: string;
    display_name: string;
    active: boolean | undefined;
    used_for_billing: boolean | undefined;
    type: string | undefined;
  }>(blankMeter);
  const [showInputRow, setShowInputRow] = useState<boolean>(false);

  const fetchMeters = () =>
    fetch('https://take-home-exercise-api.herokuapp.com/meters', { headers: { 'API-KEY': apiKey } })
      .then((response) => response.json())
      .then((data) => {
        setMeters(data);
      });

  useEffect(() => {
    // add catch
    fetchMeters();
  }, []);

  // TODO add comment
  useEffect(() => {
    if (deleteMeter.display_name) {
      onOpen();
    }
  }, [deleteMeter.display_name]);

  const onClickRow = (row) => {
    const { id, api_name, display_name, active, used_for_billing, type } = row.original;
    const searchParams = createSearchParams({ id, api_name, display_name, active, used_for_billing, type });
    navigate({
      pathname: '/meter-details',
      search: searchParams.toString(),
    });
  };
  const onClickDelete = (id: string, display_name: string) => {
    setDeleteMeter({ display_name, id });
  };

  const onClickAdd = () => {
    // add catch
    fetch('https://take-home-exercise-api.herokuapp.com/meters', {
      method: 'POST',
      headers: { 'API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(newMeter),
    })
      .then(() => {
        fetchMeters();
        setNewMeter(blankMeter);
        setShowInputRow(false);
      })
      .catch((error) => console.log('error', error));
  };

  const getBooleanSelectValue = (value: boolean | undefined): string => {
    if (value === undefined) {
      return '';
    } else if (value === true) {
      return 'Yes';
    }
    return 'No';
  };

  // make rows clickable, but not if is an initial meter
  const columns = useMemo(
    () => [
      {
        Header: 'Display Name',
        accessor: 'display_name',
      },
      {
        Header: 'API Name',
        accessor: 'api_name',
      },
      {
        Header: 'Active',
        accessor: 'active',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
      {
        Header: 'Used for Billing',
        accessor: 'used_for_billing',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: ({ value }) => (value[0].toUpperCase() + value.slice(1)).replace('_', ' '),
      },
      {
        accessor: 'action',
        Cell: ({ row }) => (
          <Button
            onClick={(e) => {
              // Without the below line, `e` propogates so that this button click is interpreted as a row click
              e.stopPropagation();
              onClickDelete(row.original.id, row.original.display_name);
            }}
          >
            Delete
          </Button>
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
              <tr {...row.getRowProps()} onClick={() => onClickRow(row)}>
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
                  name="display_name"
                  placeholder="Display Name"
                  value={newMeter.display_name}
                  onChange={(e) => setNewMeter({ ...newMeter, display_name: e.target.value })}
                />
              </td>
              <td>
                <Input
                  isRequired
                  name="api_name"
                  placeholder="API Name"
                  value={newMeter.api_name}
                  onChange={(e) => setNewMeter({ ...newMeter, api_name: e.target.value })}
                />
              </td>
              <td>
                <Select
                  name="active"
                  placeholder='Select "Active"'
                  value={getBooleanSelectValue(newMeter.active)}
                  onChange={(e) => setNewMeter({ ...newMeter, active: e.target.value === 'Yes' ? true : false })}
                >
                  <option>Yes</option>
                  <option>No</option>
                </Select>
              </td>
              <td>
                <Select
                  name="used_for_billing"
                  placeholder='Select "Used for Billing"'
                  value={getBooleanSelectValue(newMeter.used_for_billing)}
                  onChange={(e) =>
                    setNewMeter({ ...newMeter, used_for_billing: e.target.value === 'Yes' ? true : false })
                  }
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
                  <option value="max">Max</option>
                  <option value="sum">Sum</option>
                  <option value="unique_count">Unique count</option>
                </Select>
              </td>
              <td>
                <Button
                  isDisabled={
                    !newMeter.api_name ||
                    !newMeter.display_name ||
                    newMeter.active === undefined ||
                    newMeter.used_for_billing === undefined ||
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
      <DeleteModal isOpen={isOpen} onClose={onClose} display_name={deleteMeter.display_name} id={deleteMeter.id} />
    </>
  );
};
