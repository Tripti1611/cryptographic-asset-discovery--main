import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSkeleton, TableContainer, TableToolbar, TableToolbarContent, TableToolbarSearch, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, OverflowMenu, OverflowMenuItem, Button, Modal, Loading } from '@carbon/react';
import { CheckmarkFilled, ErrorFilled } from '@carbon/react/icons';
import * as http from "../../services/httpBaseService.js";
import api from "../../common/utils/apiconstants.js";
import SystemDetailsForm from '../SystemDetailsForm/SystemDetailsForm.jsx';
import './Systems.scss';
import Assets from '../Assets/Assets.jsx';
import PolicyEngine from '../PolicyEngine/PolicyEngine.jsx';

export default function Systems () {
    const [showAddSystem, setShowAddSystem] = useState(false);
    const [showDiscoverySuccess, setShowDiscoverySuccess] = useState(false);
    const [showDiscoveryError, setShowDiscoveryError] = useState(false);
    const [showAssets, setShowAssets] = useState(false);
    const [rowDataLoaded, setRowDataLoaded] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [serverIP, setServerIP] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPolicyEngine, setShowPolicyEngine] = useState(false);

    const headerData = [
        {
            key: "server",
            header: "System IP/Hostname"
        },
        {
            key: "username",
            header: "Username"
        },
        {
            key: "status",
            header: "Status"
        },
        {
            key: "discover",
            header: "Discover"
        }
    ];

    /**
    * @description fetch all systems
    */
    const getSystems = () => {
        setIsLoading(true);
        http.GET_API_CALL(api.SYSTEMS).then(data => {
            data.map((item) => {
                item.id = item.server;
                item.discover = <div className="systems__sb-two-lines">
                <Button type="button" id={item.server} className="systems__btns" onClick={discoverClickHandler}>Discover</Button>
                <Button type="button" id={item.server} className="systems__btns" kind="secondary" onClick={showPolicyEngineHandler}>Policy Engine</Button>
                <Button id={item.server} kind="tertiary" onClick={showAssetClickHandler}>Show details</Button>
                </div>;
            });
            setRowData(data);
            setRowDataLoaded(true);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        setIsLoading(false);
        getSystems();
    }, []);

    const discoverClickHandler = (e) => {
        setIsLoading(true);
        const params = { "server_name": e.target.id };
        http.POST_API_CALL(api.SYSTEM_DISCOVER, params).then(res => {
            if (res.status === 200){
                setShowDiscoverySuccess(true);
                setSuccessMsg(res.data.message);
            }
            else{
                console.log(res.response.data);
                setShowDiscoveryError(true);
                setErrorMsg(res.response.data);
            }
            setIsLoading(false);
        });
    }

    const showPolicyEngineHandler = (e) => {
        setShowPolicyEngine(true);
        setServerIP(e.target.id);
    }

    const showAssetClickHandler = (e) => {
        setShowAssets(true);
        setServerIP(e.target.id);
    }

    const addSystemClose = () => {
        setShowAddSystem(false);
        setRowDataLoaded(false);
        setRowData([]);
        getSystems();
    }

    const handleDiscoverClose = () => {
        setShowDiscoverySuccess(false);
        setShowDiscoveryError(false);
        setErrorMsg("");
        setSuccessMsg("");
        setRowDataLoaded(false);
        setRowData([]);
        getSystems();
    }

    return(
      <>
      {isLoading && <Loading active={isLoading} description="Active loading indicator" withOverlay={true}/>}

      {showAddSystem && <SystemDetailsForm onSubmit={addSystemClose}></SystemDetailsForm>}

      {showPolicyEngine && <PolicyEngine onSubmit={() => setShowPolicyEngine(false)}></PolicyEngine>}

      {showDiscoverySuccess && 
      <Modal 
        aria-label="Success"
        id="Success"
        modalHeading={<div><CheckmarkFilled className='passiveModal_iconTitleContainer_icon_success' size={21} />{"     "+successMsg}</div>}
        modalAriaLabel={String(successMsg)}
        open={showDiscoverySuccess} 
        passiveModal={true} 
        preventCloseOnClickOutside={true}
        onRequestClose={handleDiscoverClose}
        size="sm"
      >
        <div className='systems__discover'>
            <p>Click <strong><i>Show details</i></strong> to view the report.</p>
        </div>
      </Modal>}

      {showDiscoveryError && 
      <Modal 
        aria-label="Error"
        id="Error"
        modalHeading={<div><ErrorFilled className='passiveModal_iconTitleContainer_icon_error' size={21} /> Error</div>}
        modalAriaLabel={String(errorMsg)}
        open={showDiscoveryError} 
        passiveModal={true} 
        preventCloseOnClickOutside={true}
        onRequestClose={handleDiscoverClose}
        size="sm"
      >
        <div className='systems__discover'>
            {/* {errorMsg} */}
            <p>Authentication Failed!!</p>
        </div>
      </Modal>}

      {showAssets && <Assets system={serverIP} onSubmit={() => setShowAssets(false)}></Assets>}

      <div className='systems'>
        {rowDataLoaded === false && <DataTableSkeleton columnCount={headerData.length} rowCount={5} headers={headerData}/>}
        
        {rowDataLoaded && 
        <DataTable rows={rowData} headers={headerData} isSortable className='systems__table'>
            {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getToolbarProps, onInputChange }) =>
            <TableContainer title="Systems for Discovery">
            <TableToolbar {...getToolbarProps()} aria-label="systems">
                <TableToolbarContent>
                <TableToolbarSearch onChange={onInputChange} />
                <Button onClick={() => {setShowAddSystem(true)}}>Add Systems</Button>
                </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} aria-label="systems">
                <TableHead>
                <TableRow>
                {headers.map(header => 
                    <TableHeader key={header.key} {...getHeaderProps({header})}>
                    {header.header}
                    </TableHeader>)}
                    <TableHeader />
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map(row => 
                <TableRow key={row.id} {...getRowProps({row})}>
                    {row.cells.map(cell => <TableCell key={cell.id}>{cell.value}</TableCell>)}
                    <TableCell className="cds--table-column-menu">
                    <OverflowMenu size="sm" flipped>
                        <OverflowMenuItem itemText="Refresh" />
                        <OverflowMenuItem itemText="Stop" />
                        <OverflowMenuItem itemText="Pause" />
                        <OverflowMenuItem itemText="Restart" />
                        <OverflowMenuItem itemText="Remove" />
                    </OverflowMenu>
                    </TableCell>
                </TableRow>)}
                </TableBody>
            </Table>
            </TableContainer>}
        </DataTable>}
      </div>
      </>
    );
}
