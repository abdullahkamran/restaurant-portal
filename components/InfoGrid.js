import {
  MDBContainer,
  MDBAlert, MDBDataTableV5, MDBRow, MDBCol, MDBNavbar, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBDropdown, MDBDropdownItem, MDBIcon,
  MDBDropdownToggle, MDBDropdownMenu, MDBCard, MDBCardBody, MDBCardTitle,
} from 'mdbreact';

import {
  Button, Select, Tabs, Popconfirm,
} from 'antd';

import { infoColumns } from '../utils/gridConfigs';

import { useState, useEffect, useRef } from 'react';

import InfoModal from './InfoModal';

import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ajaxFetch } from '../utils/ajaxUtils';

export default function InfoGrid({ data = [] ,setLoading, setAlertState }) {

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoInitialValues, setInfoInitialValues] = useState({});

  function getInfoTableData(data) {
    const infoRows = data.map(entry => ({
      ...entry,
      edit:
        <div>
          <Button
            shape="circle"
            icon={<EditOutlined style={{position: 'absolute', top: '4px', left: '7px'}}/>}
            onClick={() => editInfo(entry)}
            type="primary"
          ></Button>
          <Popconfirm
            placement="top"
            title={"Delete?"}
            onConfirm={() => deleteInfo(entry)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              shape="circle"
              icon={<DeleteOutlined style={{position: 'absolute', top: '4px', left: '8px'}}/>}
              type="primary"
            ></Button>
          </Popconfirm>
        </div>
    }));
    return {
      columns: infoColumns,
      rows: infoRows,
    }
  }

  function addInfo() {
    setInfoInitialValues({});
    setInfoModalVisible(true);
  }

  function editInfo(entry) {
    setInfoInitialValues({
      ...entry,
    });
    setInfoModalVisible(true);
  }

  function deleteInfo(entry) {
    ajaxFetch({
      url: `http://localhost:5000/api/v1/info/${entry._id}`,
      method: 'DELETE',
    });
  }

  return (
    <MDBContainer>

      <InfoModal
        visible={infoModalVisible}
        setVisible={setInfoModalVisible}
        initialValues={infoInitialValues}
        setAlertState={setAlertState}
      />

      <MDBRow>
        <MDBCol>
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Info</MDBCardTitle>
              <Button
                type="primary"
                icon={<PlusOutlined style={{position: 'absolute', top: '7px', left: '8px'}}/>}
                style={{ float : 'right'}}
                onClick={addInfo}>
                Add Info
              </Button>
              <MDBDataTableV5
                hover
                entriesOptions={[5, 10, 20, 50, 100]}
                entries={10}
                data={getInfoTableData(data)}
                searchTop
                searchBottom={false} />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}