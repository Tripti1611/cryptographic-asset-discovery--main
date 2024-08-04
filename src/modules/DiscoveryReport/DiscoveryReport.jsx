import React, { useState } from 'react';
import { Modal, Stack, DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
import '../../styles/_common.scss';

export default function DiscoveryReport(props) {
    const [open, setOpen] = useState(true);
    const headers = [
      {
        key: "securityAsset",
        header: "Security Asset"
      },
      {
        key: "type",
        header: "Type"
      },
      {
        key: "expiry",
        header: "Expiry"
      },
      {
        key: "algorithm",
        header: "Algorithm"
      },
      {
        key: "keyLength",
        header: "Key Length"
      }
    ];

    const rows = [
      {
        id: "r1",
        securityAsset: "Abhc jshdgfhj",
        type: "jhgduyg",
        expiry: "29-09-2025",
        algorithm: "RSA",
        keyLength: 256
      }
    ];

    const handleClose = () => {
      setOpen(false);
      props.onSubmit();
    }

    return (
        <Modal
          aria-label="discoveryReport"
          id="discoveryReport"
          modalAriaLabel="Discovery Report"
          modalHeading="Discovery Report"
          size="lg"
          passiveModal={true}
          open={open}
          onRequestClose={handleClose}
          closeButtonLabel="Close"
        >
          <Stack gap={5}>
          <strong className="modal__ip">IP/Hostname: 1.1.1.1</strong>

          <DataTable rows={rows} headers={headers}>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()}>
            <TableHead>
                <TableRow>
                {headers.map((header) => (
                <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                </TableHeader>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                </TableRow>
                ))}
            </TableBody>
            </Table>
            )}
          </DataTable>
          </Stack>
        </Modal>
    );
}
