import React, { useState, useEffect } from 'react';
import { Modal, Stack, DataTable, DataTableSkeleton, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { CircleFill } from '@carbon/icons-react';
import * as http from "../../services/httpBaseService.js";
import api from "../../common/utils/apiconstants.js";
import '../../styles/_common.scss';

export default function Assets(props) {
    const server_name = props.system;
    const [open, setOpen] = useState(true);
    const [rowData, setRowData] = useState([]);
    const [rowDataLoaded, setRowDataLoaded] = useState(false);
    const [krowData, setKrowData] = useState([]);
    const [krowDataLoaded, setKrowDataLoaded] = useState(false);

    const headerData = [
      {
        key: "certificate_name",
        header: "Security Asset"
      },
      {
        key: "public_key",
        header: "Key Length"
      },
      {
        key: "public_key_algorithm",
        header: "Algorithm"
      },
      {
        key: "issuer",
        header: "Issuer"
      },
      {
        key: "enddate",
        header: "Expiry"
      },
      {
        key: "status",
        header: "Status"
      }
    ];

    const kheaderData = [
      {
        key: "key_type",
        header: "Key type"
      },
      {
        key: "uuid",
        header: "Universal Unique Identifier (uuid)"
      },
      {
        key: "key_length",
        header: "Key Length"
      },
      {
        key: "algorithm",
        header: "Algorithm"
      },
      {
        key: "expiration_date",
        header: "Expiry"
      },
      {
        key: "status",
        header: "Status"
      }
    ];

    useEffect(() => {
        getAssets();
    }, []);

    const cmpDate = (dt) => {
        let now = new Date();
        dt = new Date(dt);
        let currentDt = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        let certDt = Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate());
        return parseInt((certDt - currentDt) / (1000 * 60 * 60 * 24), 10); 
    }

    /**
     * @description get all assets
     */
    const getAssets = () => {
        http.GET_API_CALL(api.SYSTEM_ASSET+"?server_name='"+server_name+"'").then(data => {
            data.map((item) => {
                let diff = cmpDate(item.enddate);
                item.id = item.certificate_name;
                item.status = (diff <= 30 && diff > 0) ? <CircleFill className='circleYellowIcon' /> : (diff <= 0 ? <CircleFill className='circleRedIcon' /> : <CircleFill className='circleGreenIcon' />);
            });
            setRowData(data);
            setRowDataLoaded(true);
        });

        http.GET_API_CALL(api.SYTEM_KMIP+"?server_name='"+server_name+"'").then(kdata => {
          kdata.map((kitem) => {
              let diff1 = cmpDate(kitem.enddate);
              kitem.id = kitem.uuid;
              kitem.status = (diff1 <= 30 && diff1 > 0) ? <CircleFill className='circleYellowIcon' /> : (diff1 <= 0 ? <CircleFill className='circleRedIcon' /> : <CircleFill className='circleGreenIcon' />);
          });
          setKrowData(kdata);
          setKrowDataLoaded(true);
      });
    }

    const handleClose = () => {
      setOpen(false);
      props.onSubmit();
    }

    return (
        <Modal
          aria-label="assets"
          id="assets"
          modalAriaLabel="Assets"
          modalHeading="Assets"
          size="lg"
          passiveModal={true}
          open={open}
          onRequestClose={handleClose}
          closeButtonLabel="Close"
        >
          <Stack gap={5}>
          <strong className='modal_ip'>IP/Hostname: {server_name}</strong>

          {rowDataLoaded === false && <DataTableSkeleton columnCount={headerData.length} rowCount={5} headers={headerData}/>}

          {rowDataLoaded && 
          <DataTable rows={rowData} headers={headerData} isSortable>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title="Security Asset">
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
                        <TableCell className="cds--table-column-menu menu-cell">
                        <OverflowMenu size="sm" flipped={false} className='menu-overlay'>
                            <OverflowMenuItem itemText="Replace" />
                            <OverflowMenuItem itemText="Delete" />
                        </OverflowMenu>
                        </TableCell>
                    </TableRow>
                    )
                }
            </TableBody>
            </Table>
            </TableContainer>
            )}
          </DataTable>}

          {krowDataLoaded === false && <DataTableSkeleton columnCount={kheaderData.length} rowCount={5} headers={kheaderData}/>}

          {krowDataLoaded && 
          <DataTable rows={krowData} headers={kheaderData} isSortable>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title="Key Manager Assets">
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
                {krowData.length === 0 ? 
                    <TableRow>
                        <TableCell colSpan={kheaderData.length}>No Data Found!</TableCell>
                    </TableRow>
                :
                    rows.map((row) =>
                    <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => 
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                        )}
                        <TableCell className="cds--table-column-menu menu-cell">
                        <OverflowMenu size="sm" flipped={false} className='menu-overlay'>
                            <OverflowMenuItem itemText="Replace" />
                            <OverflowMenuItem itemText="Delete" />
                        </OverflowMenu>
                        </TableCell>
                    </TableRow>
                    )
                }
            </TableBody>
            </Table>
            </TableContainer>
            )}
          </DataTable>}
          </Stack>
        </Modal>
    );
}
