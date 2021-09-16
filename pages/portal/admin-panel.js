

import Head from 'next/head'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  MDBContainer,
  MDBAlert, MDBRow, MDBCol, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBIcon,
  MDBDropdownToggle,
} from 'mdbreact';
import {
  Spin, Tabs, Dropdown, Menu
} from 'antd';
import { InfoCircleOutlined, MenuOutlined, OrderedListOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

import InfoGrid from '../../components/InfoGrid';
import CategoryGrid from '../../components/CategoryGrid';
import DishGrid from '../../components/DishGrid';
import { ajaxFetch } from '../../utils/ajaxUtils';
import { deleteCookie } from '../../utils/cookieUtils';

export default function AdminPanel() {

  const router = useRouter();

  const [infoData, setInfoData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    color: null,
    content: null,
  });

  useEffect(() => {
    sendCategoriesRequest();
  }, []);

  useEffect(() => {
    if (alertState.isOpen) {
      setTimeout(() => {
        setAlertState(prevState => ({ ...prevState, isOpen: false }));
      }, '3000');
    }
  }, [alertState]);

  function sendCategoriesRequest() {
    setLoading(true);
    ajaxFetch({ url: `/api/v1/category/all/dishes` }, (xhr) => {
      if (xhr.status === 200) {
        setCategories(JSON.parse(xhr.response));
      } else {
        console.log('error');
        setAlertState({
          isOpen: true,
          color: 'danger',
          messages: ['Something went wrong.'],
        });
      }
      setLoading(false);
    });
  }

  function sendPutRequest(url, body) {
    console.log(url, body);
  }

  // function submitCategoryForm() {
  //   const formElements = categoryFormRef.current.elements;
  //   const errorMessages = [];

  //   const categoryName = formElements.name.value;
  //   if (!categoryName) {
  //     formElements.name.setAttribute('invalid', true);
  //     errorMessages.push('Name is required.');
  //   } else {
  //     for (const category of categories) {
  //       if (formState.modifyId !== category.id && category.name === categoryName) {
  //         formElements.name.setAttribute('invalid', true);
  //         errorMessages.push('Category name already exists.');
  //       }
  //     }
  //   }
  //   if (errorMessages.length === 0) {
  //     formElements.name.removeAttribute('invalid');
  //   }

  //   const categoryDescription = formElements.description.value;

  //   const categoryOrder = formElements.order.value;
  //   if (!categoryOrder) {
  //     formElements.order.setAttribute('invalid', true);
  //     errorMessages.push('Order is required.');
  //   } else if (parseInt(categoryOrder, 10) < 0) {
  //     formElements.order.setAttribute('invalid', true);
  //     errorMessages.push('Order can not be negative.');
  //   } else {
  //     formElements.order.removeAttribute('invalid');
  //   }

  //   if (errorMessages.length > 0) {
  //     setAlertState({
  //       isOpen: true,
  //       color: 'danger',
  //       messages: errorMessages,
  //     });
  //   } else {
  //     setAlertState({ isOpen: false });
  //     sendPutRequest(`/api/categories/${formState.modifyId}`, {
  //       name: categoryName,
  //       description: categoryDescription,
  //       order: categoryOrder,
  //     });
  //   }

  // }

  function logout() {
    setLoading(true);
    deleteCookie('access_token', '/', 'localhost');
    router.push('/portal/login?logout');
  }

  return (
    <>
      <Spin spinning={isLoading}>
        <MDBNavbar color="blue" dark expand="md">
          <MDBNavbarBrand>
            <strong className="white-text">Lahore Restaurant</strong>
          </MDBNavbarBrand>
          <MDBNavbarNav right>
            <MDBNavItem>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={logout}>Logout</Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
                trigger={'click'}>
                <MDBDropdownToggle nav caret>
                  <MDBIcon icon="user" />
                </MDBDropdownToggle>
              </Dropdown>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBNavbar>
        <MDBContainer fluid>
          <Head>
            <title>Lahore Restaurant - Admin Panel</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Tabs defaultActiveKey="2">
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined />
                  Info
                </span>
              }
              key="1"
            >
              <InfoGrid data={infoData} setLoading={setLoading} setAlertState={setAlertState} />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <MenuOutlined />
                  Categories
                </span>
              }
              key="2"
            >
              <CategoryGrid
                categories={categories}
                notifyCategoriesChanged={sendCategoriesRequest}
                setLoading={setLoading}
                setAlertState={setAlertState}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <OrderedListOutlined />
                  Dishes
                </span>
              }
              key="3"
            >
              <DishGrid
                categories={categories}
                notifyCategoriesChanged={sendCategoriesRequest}
                setLoading={setLoading} />
            </TabPane>
          </Tabs>
        </MDBContainer>
      </Spin>
      {alertState.isOpen &&
        <div style={{ position: 'fixed', bottom: '0px', right: '16px', zIndex: '9999', width: '70%' }}>
          <MDBAlert color={alertState.color}>
            <MDBContainer>
              <MDBRow>
                <MDBCol>
                  {alertState.messages.map((message, i) =>
                    <MDBRow key={i}><strong>{message}</strong></MDBRow>
                  )}
                </MDBCol>
                <MDBCol size="1">
                  <button className="close" aria-label="Close" onClick={() => setAlertState({ isOpen: false })}>
                    <span aria-hidden="true">×</span>
                  </button>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBAlert>
        </div>
      }
    </>
  )
}
