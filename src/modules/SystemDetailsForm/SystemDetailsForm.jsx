import React, { useState } from 'react';
import { Modal, FormGroup, TextInput, Stack } from '@carbon/react';
import { CheckmarkFilled, ErrorFilled } from '@carbon/react/icons';
import * as http from "../../services/httpBaseService.js";
import api from "../../common/utils/apiconstants.js";
import '../../styles/_common.scss';

export default function SystemDetailsForm(props) {
  const [ip, setIp] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * @description post call to add system
   */
  const addSystem = (ip, user, password) => {
    const params = {
      "machine_ip": ip,
      "username": user,
      "password": password
    };

    http.POST_API_CALL(api.SYSTEMS_ADD, params).then(res => {
      if (res.status === 200){
        setSuccess(true);
        setSuccessMsg(res.data.message);
      }
      else {
        setError(true);
        setErrorMsg(res.response.data);
      }
      setOpen(false);
      // props.onSubmit();
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can perform further actions with the form data here, like sending it to a server.
    console.log('Form data submitted:', { ip, user, password });
    addSystem(ip, user, password);
  };

  const handleClose = () => {
    setOpen(false);
    props.onSubmit();
  };

  const handleNotiClose = () => {
    setSuccess(false);
    setError(false);
    setErrorMsg("");
    setSuccessMsg("");
    props.onSubmit();
  };

  return (
    <>
    {success && 
      <Modal 
        aria-label="Success"
        id="Success"
        modalHeading={<div><CheckmarkFilled className='passiveModal_iconTitleContainer_icon_success' size={21} /> Success</div>}
        modalAriaLabel={String(successMsg)}
        open={success} 
        passiveModal={true} 
        preventCloseOnClickOutside={true}
        onRequestClose={handleNotiClose}
        size="sm"
      >
      <div className='systems__discover'>
          <p>{successMsg}</p>
      </div>
    </Modal>}

    {error &&
      <Modal 
      aria-label="Error"
      id="Error"
      modalHeading={<div><ErrorFilled className='passiveModal_iconTitleContainer_icon_error' size={21} /> Error</div>}
      modalAriaLabel={String(errorMsg)}
      open={error} 
      passiveModal={true} 
      preventCloseOnClickOutside={true}
      onRequestClose={handleNotiClose}
      size="sm"
    >
      <div className='systems__discover'>
          <p>{errorMsg}</p>
      </div>
    </Modal>}

    <Modal 
      className="system-details-form"
      aria-label="addSystem"
      id="addSystem"
      modalAriaLabel="Add System"
      modalHeading="Add System"
      size="sm"
      open={open}
      onRequestClose={handleClose}
      onRequestSubmit={handleSubmit}
      primaryButtonText="Add System"
      secondaryButtonText="Cancel"
      shouldSubmitOnEnter={true}
    >
      <FormGroup
        legend-id="system-details"
        legendText="Enter your system details"
      >
        <Stack gap={5}>
          <TextInput 
            id="ipHostName"
            labelText="IP/Hostname"
            placeholder="Enter IP/Hostname"
            size="md"
            value={ip}
            onChange={(e)=>{setIp(e.target.value)}}
          />

          <TextInput 
            id="user"
            labelText="User"
            placeholder="Enter username"
            size="md"
            value={user}
            onChange={(e)=>{setUser(e.target.value)}}
          />

          <TextInput 
            id="password"
            type="password"
            labelText="Password"
            placeholder="Enter password"
            size="md"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
          />
        </Stack>
      </FormGroup>
    </Modal>
    </>
  );
}
