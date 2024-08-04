import React, { useState } from 'react';
import { Modal, Form, TextInput, Select, SelectItem, Button, Stack, Grid, Column, DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import { CircleFill } from '@carbon/react/icons';
import '../../styles/_common.scss';

export default function PolicyEngine(props) {
  const [col, setCol] = useState("Select option");
  const [condition, setCondition] = useState("Select option");
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState("Select option");
  const [open, setOpen] = useState(true);
  const [rowData, setRowData] = useState([]);

  const colValue = [
    {
        id: "c0",
        value: "Select option"
    },
    {
        id: "c1",
        value: "Key Length"
    },
    {
        id: "c2",
        value: "Algorithm"
    },
    {
        id: "c3",
        value: "Expiry"
    }
  ];

  const condValue = [
    {
        id: "d0",
        value: "Select option"
    },
    {
        id: "d1",
        value: "Less than"
    },
    {
        id: "d2",
        value: "Greater than"
    },
    {
        id: "d3",
        value: "Equal to"
    }
  ];

  const statusValue = [
    {
        id: "s0",
        text: "Select option",
        value: "Select option"
    },
    {
        id: "s1",
        text: "weak",
        value: <CircleFill className='circleRedIcon' />
    },
    {
        id: "s2",
        text: "medium",
        value: <CircleFill className='circleYellowIcon' />
    },
    {
        id: "s3",
        text: "strong",
        value: <CircleFill className='circleGreenIcon' />
    },
  ];

  const headerData = [
    {
        key: "value",
        header: "Rule"
    }
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can perform further actions with the form data here, like sending it to a server.
    // console.log('Form data submitted:', { col, condition, inputText, status });
    addRule(col, condition, inputText, status);
  };

  const addRule = (para, cond, val, sta) => {
    let str = para+" "+cond+" "+val+" is "+sta;
    setRowData(
        [
            ...rowData,
            {
                id: val,
                value: str
            },
        ]
    );
    setCol("Select option");
    setCondition("Select option");
    setInputText('');
    setStatus("Select option");
  };

  const handleClose = () => {
    setOpen(false);
    props.onSubmit();
  };

  return (
    <>
    <Modal 
      className="policy-engine"
      aria-label="policy-engine"
      id="policy-engine"
      modalAriaLabel="Policy Engine"
      modalHeading="Policy Engine"
      size="lg"
      open={open}
      passiveModal={true}
      preventCloseOnClickOutside={true}
      onRequestClose={handleClose}
    >
      <Stack gap={5}>

        <Form>
          <Grid>
            <Column sm={3}>
              <Select 
                id="col"
                labelText="Select Parameter"
                size="md"
                value={col}
                onChange={(e)=>{setCol(e.target.value)}}
              >
                {colValue.map((cols) => (
                    <SelectItem key={cols.id} text={cols.value} value={cols.value}/>
                ))}
              </Select>
            </Column>

            <Column sm={3}>
              <Select 
                id="condition"
                labelText="Select Condition"
                size="md"
                value={condition}
                onChange={(e)=>{setCondition(e.target.value)}}
              >
                {condValue.map((cond) => (
                    <SelectItem key={cond.id} text={cond.value} value={cond.value}/>
                ))}
              </Select>
            </Column>

            <Column sm={3}>
              <TextInput 
                id="inputText"
                type="text"
                labelText="Enter Value"
                placeholder="Enter value"
                size="md"
                value={inputText}
                onChange={(e)=>{setInputText(e.target.value)}}
              />
            </Column>

            <Column sm={3}>
              <Select 
                id="status"
                labelText="Select Status"
                size="md"
                value={status}
                onChange={(e)=>{setStatus(e.target.value)}}
              >
                {statusValue.map((state) => (
                    <SelectItem key={state.id} text={state.text} value={state.text}/>
                ))}
              </Select>
            </Column>

            <Column sm={1} className='add-rule'>
              <Button
                className='add-rule-btn'
                type="button"
                id="add"
                onClick={handleSubmit}
              >
                +
              </Button>
            </Column>
          </Grid>
        </Form>

        <DataTable rows={rowData} headers={headerData} isSortable>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title="Policies">
            <Table {...getTableProps()}>
            <TableHead>
                <TableRow>
                    {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                    </TableHeader>
                    ))}
                    <TableHeader />
                </TableRow>
            </TableHead>
            <TableBody>
                {rowData.length === 0 ? 
                    <TableRow>
                        <TableCell colSpan={headerData.length}>No Data Found!</TableCell>
                    </TableRow>
                :
                    rows.map((row) =>
                    <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => 
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                        )}
                    </TableRow>
                    )
                }
            </TableBody>
            </Table>
            </TableContainer>
            )}
          </DataTable>
      </Stack>
    </Modal>
    </>
  );
}
