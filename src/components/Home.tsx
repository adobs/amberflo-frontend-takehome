import { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import {
  Button,
  Input,
  Select,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { PlusSquareIcon, DeleteIcon, ChevronUpIcon, ChevronDownIcon, UpDownIcon } from '@chakra-ui/icons';
import { useNavigate, createSearchParams } from 'react-router-dom';

import { DeleteModal } from './DeleteModal';
import { Header } from './Header';
import { useCustomToast } from '../providers/ToastProvider';
import { INITIALLY_SEEDED_IDS } from '../utils';

interface Meter {
  id: string;
  api_name: string;
  display_name: string;
  active: boolean;
  used_for_billing: boolean;
  type: 'sum' | 'max' | 'unique_count';
}

export const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { showToast } = useCustomToast();
  const apiKey = process.env.REACT_APP_API_KEY;

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
      })
      .catch(() => showToast('An unexpected error occured', 'error'));

  useEffect(() => {
    fetchMeters();
  }, []);

  const onClickRow = (row) => {
    const { id, api_name, display_name, active, used_for_billing, type } = row.original;
    const searchParams = createSearchParams({ id, api_name, display_name, active, used_for_billing, type });
    navigate({
      pathname: '/meter-details',
      search: searchParams.toString(),
    });
  };

  const onClickAdd = () => {
    fetch('https://take-home-exercise-api.herokuapp.com/meters', {
      method: 'POST',
      headers: { 'API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(newMeter),
    })
      .then((response) => response.json())
      .then((data) => {
        setMeters([...meters, data]);
        showToast(`Successfully added "${data.display_name}" meter`, 'success');
        setNewMeter(blankMeter);
        setShowInputRow(false);
      })
      .catch(() => showToast(`Unable to add "${newMeter.display_name}"`, 'error'));
  };

  const getBooleanSelectValue = (value: boolean | undefined): string => {
    if (value === undefined) {
      return '';
    } else if (value === true) {
      return 'Yes';
    }
    return 'No';
  };

  // Alphbetic sorting, case insensitive
  const sortDisplayName = (a, b) =>
    a.original.display_name.toLowerCase().localeCompare(b.original.display_name.toLowerCase());

  // Alphbetic sorting, case insensitive
  const sortApiName = (a, b) => a.original.api_name.toLowerCase().localeCompare(b.original.api_name.toLowerCase());

  const sortActive = (a, b) => {
    if (a.original.active < b.original.active) {
      return -1;
    } else if (a.original.active > b.original.active) {
      return 1;
    }
    return 0;
  };

  const sortBilling = (a, b) => {
    if (a.original.used_for_billing < b.original.used_for_billing) {
      return -1;
    } else if (a.original.used_for_billing > b.original.used_for_billing) {
      return 1;
    }
    return 0;
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Display Name',
        accessor: 'display_name',
        sortType: sortDisplayName,
      },
      {
        Header: 'API Name',
        accessor: 'api_name',
        sortType: sortApiName,
      },
      {
        Header: 'Active',
        accessor: 'active',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
        sortType: sortActive,
      },
      {
        Header: 'Used for Billing',
        accessor: 'used_for_billing',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
        sortType: sortBilling,
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
            colorScheme="red"
            onClick={(e) => {
              // Without the below line, `e` propogates so that this button click is interpreted as a row click
              e.stopPropagation();
              setDeleteMeter({ display_name: row.original.display_name, id: row.original.id });
              onOpen();
            }}
            variant="outline"
            leftIcon={<DeleteIcon />}
            // Cannot delete the 3 meters that are initially seeded in API
            isDisabled={INITIALLY_SEEDED_IDS.indexOf(row.original.id) !== -1}
          >
            Delete
          </Button>
        ),
        disableSortBy: true,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, rows, prepareRow, headers } = useTable(
    {
      columns,
      data: meters,
      initialState: {
        sortBy: [
          {
            id: 'display_name',
            desc: false,
          },
        ],
      },
    },
    useSortBy
  );

  return (
    <>
      <Header isHomePage />
      <TableContainer p={4} m={4} border="gray 2px solid" borderRadius={8} boxShadow="3px 3px 3px lightgray">
        <Table {...getTableProps()}>
          <Thead>
            <Tr>
              {headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {/* Sort arrows not needing for column with Delete button (no sorting occurs on that column ) */}
                    {column.canSort ? (
                      column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronDownIcon boxSize={4} />
                        ) : (
                          <ChevronUpIcon boxSize={4} />
                        )
                      ) : (
                        <UpDownIcon pb={1} boxSize={4} />
                      )
                    ) : (
                      <></>
                    )}
                  </span>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  _hover={{ bg: '#f2f2f2', border: '2px gray solid', borderRadius: '4px' }}
                  onClick={() => onClickRow(row)}
                >
                  {row.cells.map((cell) => {
                    return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
                  })}
                </Tr>
              );
            })}
            {showInputRow && (
              <Tr>
                <Td>
                  <Input
                    placeholder="Display Name"
                    value={newMeter.display_name}
                    onChange={(e) => setNewMeter({ ...newMeter, display_name: e.target.value })}
                  />
                </Td>
                <Td>
                  <Input
                    placeholder="API Name"
                    value={newMeter.api_name}
                    onChange={(e) => setNewMeter({ ...newMeter, api_name: e.target.value })}
                  />
                </Td>
                <Td>
                  <Select
                    placeholder="[SELECT]"
                    value={getBooleanSelectValue(newMeter.active)}
                    onChange={(e) => setNewMeter({ ...newMeter, active: e.target.value === 'Yes' ? true : false })}
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </Select>
                </Td>
                <Td>
                  <Select
                    placeholder="[SELECT]"
                    name="used_for_billing"
                    value={getBooleanSelectValue(newMeter.used_for_billing)}
                    onChange={(e) =>
                      setNewMeter({ ...newMeter, used_for_billing: e.target.value === 'Yes' ? true : false })
                    }
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </Select>
                </Td>
                <Td>
                  <Select
                    placeholder="[SELECT]"
                    name="type"
                    value={newMeter.type}
                    onChange={(e) => setNewMeter({ ...newMeter, type: e.target.value })}
                  >
                    <option value="max">Max</option>
                    <option value="sum">Sum</option>
                    <option value="unique_count">Unique count</option>
                  </Select>
                </Td>
                <Td>
                  <Button
                    isDisabled={
                      !newMeter.api_name ||
                      !newMeter.display_name ||
                      newMeter.active === undefined ||
                      newMeter.used_for_billing === undefined ||
                      !newMeter.type
                    }
                    onClick={onClickAdd}
                    leftIcon={<PlusSquareIcon />}
                    colorScheme="green"
                    mr={4}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    onClick={() => {
                      setNewMeter(blankMeter);
                      setShowInputRow(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {!showInputRow && (
        <Button colorScheme="green" ml={4} onClick={() => setShowInputRow(true)} leftIcon={<PlusSquareIcon />}>
          Add meter
        </Button>
      )}
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        afterDeleteFn={fetchMeters}
        display_name={deleteMeter.display_name}
        id={deleteMeter.id}
      />
    </>
  );
};
