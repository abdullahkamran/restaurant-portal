import {
  MDBContainer,
  MDBAlert, MDBDataTableV5, MDBRow, MDBCol, MDBNavbar, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBDropdown, MDBDropdownItem, MDBIcon,
  MDBDropdownToggle, MDBDropdownMenu, MDBCard, MDBCardBody, MDBCardTitle,
} from 'mdbreact';

import {
  Button, Select, Tabs, Popconfirm,
} from 'antd';

import { categoryColumns } from '../utils/gridConfigs';

import { useState, useEffect, useRef } from 'react';

import CategoryModal from './CategoryModal';

import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ajaxFetch } from '../utils/ajaxUtils';


export default function CategoryGrid({ categories = [], notifyCategoriesChanged, setLoading, setAlertState }) {

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categoryInitialValues, setCategoryInitialValues] = useState({});
  

  function getCategoriesTableData(categories) {
    const categoryRows = categories.map(category => ({
      ...category,
      length: category.dishes.length,
      edit:
        <div>
          <Button
            shape="circle"
            icon={<EditOutlined style={{position: 'absolute', top: '4px', left: '7px'}}/>}
            onClick={() => editCategory(category)}
            type="primary"
          ></Button>
          <Popconfirm
            placement="top"
            title={"Deleting a category will delete all its dishes. Proceed?"}
            onConfirm={() => deleteCategory(category)}
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
      columns: categoryColumns,
      rows: categoryRows,
    }
  }

  function addCategory() {
    setCategoryInitialValues({});
    setCategoryModalVisible(true);
  }

  function editCategory(category) {
    setCategoryInitialValues({
      ...category,
    });
    setCategoryModalVisible(true);
  }

  function deleteCategory(category) {
    ajaxFetch({
      url: `/api/v1/category/${category._id}`,
      method: 'DELETE',
    }, (xhr) => {
      if (xhr.status === 200) {
        notifyCategoriesChanged();
        setAlertState({
          isOpen: true,
          color: 'success',
          messages: ['Success'],
        });
      } else {
        setAlertState({
          isOpen: true,
          color: 'danger',
          messages: ['Something went wrong.'],
        });
      }
    });
  }
  
  return (
    <MDBContainer>

      <CategoryModal
        visible={categoryModalVisible}
        setVisible={setCategoryModalVisible}
        initialValues={categoryInitialValues}
        notifyCategoriesChanged={notifyCategoriesChanged}
        setAlertState={setAlertState}
      />
      
      <MDBRow>
        <MDBCol>
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Categories</MDBCardTitle>
              <Button
                type="primary"
                icon={<PlusOutlined style={{position: 'absolute', top: '7px', left: '8px'}}/>}
                style={{ float : 'right'}}
                onClick={addCategory}>
                Add Category
              </Button>
              <MDBDataTableV5
                hover
                entriesOptions={[5, 10, 20, 50, 100]}
                entries={10}
                data={getCategoriesTableData(categories)}
                searchTop
                searchBottom={false}
                order={['order', 'asc']} />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}