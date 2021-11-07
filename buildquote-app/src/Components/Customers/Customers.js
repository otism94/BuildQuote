// #region Imports

// Library imports
import React, { useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Container,
  Form,
  Table,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";

// Component imports
import Loading from "../../SubComponents/Loading";

// API imports
import useCustomers from "../../API/useCustomers";

// #endregion

// #region Customers

const Customers = (props) => {
  const [query, setQuery] = useState("");
  const [deleteSuccessful, setDeleteSuccessful] = useState(null);

  if (
    deleteSuccessful === null &&
    props.history.location.state?.deleteSuccessful != null
  )
    setDeleteSuccessful(true);

  return (
    <>
      <Helmet>
        <title>Customers | BuildQuote</title>
      </Helmet>

      <Breadcrumb
        className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}
      >
        <LinkContainer exact to="/">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Customers</Breadcrumb.Item>
      </Breadcrumb>

      {deleteSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setDeleteSuccessful(false)}
          dismissible
        >
          <strong>{props.history.location.state.deletedCustomer}</strong> has
          been deleted.
        </Alert>
      ) : null}

      <Container>
        <h1 className="my-3">Customers</h1>
        <Container className="mt-2 mb-4 d-flex justify-content-between flex-wrap">
          <Container className="w-75 px-0 mx-0 mb-3">
            <Form.Control
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            ></Form.Control>
          </Container>

          <LinkContainer exact to="/customers/new">
            <Button variant="outline-success" className="mb-3">
              <i className="fas fa-plus-circle"></i> New Customer
            </Button>
          </LinkContainer>
        </Container>
        <CustomersTable query={query} />
      </Container>
    </>
  );
};

// #endregion

// #region Child Components

const Customer = ({ customer }) => (
  <LinkContainer
    exact
    to={`/customers/${customer.customerId}`}
    className={"pointer"}
  >
    <tr>
      <td>{customer.fullName}</td>
      <td>{customer.city}</td>
      <td>{customer.email}</td>
      <td>{customer.phone}</td>
    </tr>
  </LinkContainer>
);

const CustomersTable = ({ query }) => {
  const { customers, customersLoading, customersError } = useCustomers();

  if (customersLoading) return <Loading />;

  if (customersError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching customers.
      </p>
    );

  const customersList =
    query === ""
      ? customers
          .map((customer) => (
            <Customer
              key={`${customer.lastName} ${customer.firstName}-${customer.customerId}`}
              customer={customer}
            />
          ))
          .sort((a, b) => b.key - a.key)
      : customers
          .filter(
            (customer) =>
              customer.fullName.toLowerCase().includes(query.toLowerCase()) ||
              customer.firstName.toLowerCase().includes(query.toLowerCase()) ||
              customer.lastName.toLowerCase().includes(query.toLowerCase()) ||
              customer.city.toLowerCase().includes(query.toLowerCase()) ||
              customer.email.toLowerCase().includes(query.toLowerCase()) ||
              customer.phone.toLowerCase().includes(query.toLowerCase())
          )
          .map((customer) => (
            <Customer key={customer.customerId} customer={customer} />
          ))
          .sort((a, b) => b.key - a.key);

  if (customersList === null) return null;

  return (
    <>
      {customersList.length > 0 ? (
        <Table responsive="md" striped hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>{customersList}</tbody>
        </Table>
      ) : (
        <p>
          <em>No customers found.</em>
        </p>
      )}
    </>
  );
};

// #endregion

export default Customers;
