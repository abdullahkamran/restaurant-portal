import {
  MDBContainer,
  MDBAlert, MDBDataTableV5, MDBRow, MDBCol, MDBNavbar, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBDropdown, MDBDropdownItem, MDBIcon,
  MDBDropdownToggle, MDBDropdownMenu, MDBCard, MDBCardBody, MDBCardTitle,
} from 'mdbreact';

import {
  Button, Select, Tabs, Popconfirm,
} from 'antd';

import { dishColumns } from '../utils/gridConfigs';

import { useState, useEffect, useRef } from 'react';

import DishModal from './DishModal';

import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ajaxFetch } from '../utils/ajaxUtils';


export default function DishGrid({ categories = [], notifyCategoriesChanged, setLoading, setAlertState }) {

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishModalVisible, setDishModalVisible] = useState(false);
  const [dishInitialValues, setDishInitialValues] = useState({});

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(selectedCategory ? { ...selectedCategory } : categories[0]);
    } else {
      setSelectedCategory(null);
    }
  }, [categories]);

  function getDishesTableData(selectedCategory) {
    let dishes = [];
    if (selectedCategory) {
      dishes = selectedCategory.dishes.map(dish => ({
        ...dish,
        edit:
          <div>
            <Button
              shape="circle"
              icon={<EditOutlined style={{position: 'absolute', top: '4px', left: '7px'}}/>}
              onClick={() => editDish(dish)}
              type="primary"
            ></Button>
            <Popconfirm
              placement="top"
              title={"Are you sure you want to delete this dish?"}
              onConfirm={() => deleteDish(dish)}
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
      })).sort(sortByOrderPredicate);
    }

    return {
      columns: dishColumns,
      rows: dishes,
    }
  }

  function handleCategoryChanged(val) {
    setSelectedCategory(categories.find(category => category._id == val));
  }

  function addDish() {
    setDishInitialValues({ category: selectedCategory._id });
    setDishModalVisible(true);
  }

  function editDish(dish) {
    setDishInitialValues({
      category: selectedCategory._id,
      ...dish,
    });
    setDishModalVisible(true);
  }

  function deleteDish(dish) {
    ajaxFetch({
      url: `/api/v1/dish/${dish._id}`,
      method: 'DELETE',
    }, (xhr) => {
      if (xhr.status === 200) {
        notifyCategoriesChanged();
        setAlertState({
          isOpen: true,
          color: 'success',
          messages: ['Saved'],
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

  function sortByOrderPredicate(a, b) {
    return a.order - b.order;
  }

  return (
    <MDBContainer>

      <DishModal
        visible={dishModalVisible}
        setVisible={setDishModalVisible}
        initialValues={dishInitialValues}
        notifyCategoriesChanged={notifyCategoriesChanged}
        setAlertState={setAlertState}
      />
      
      <MDBRow>
        <MDBCol>
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Dishes</MDBCardTitle>
              <Select
                showSearch
                value={selectedCategory && selectedCategory._id}
                placeholder="Select a category"
                onChange={handleCategoryChanged}
                style={{ width: '80%' }}
              >
                {categories.map(category =>
                  <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                )}
              </Select>
                <Button
                  type="primary"
                  icon={<PlusOutlined style={{position: 'absolute', top: '7px', left: '8px'}}/>}
                  style={{ float : 'right', width: '20%'}}
                  onClick={addDish}>
                  Add Dish
                </Button>

              <MDBDataTableV5
                hover
                entriesOptions={[5, 10, 20, 50, 100]}
                entries={10}
                data={getDishesTableData(selectedCategory)}
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
