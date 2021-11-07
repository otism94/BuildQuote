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
import Loading from "../../../SubComponents/Loading";

// API imports
import useProviders from "../../../API/useProviders";

// #endregion

// #region Providers

const Providers = (props) => {
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
        <title>Providers | BuildQuote</title>
      </Helmet>

      <Breadcrumb
        className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}
      >
        <LinkContainer exact to="/">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer exact to="/settings">
          <Breadcrumb.Item>Settings</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Providers</Breadcrumb.Item>
      </Breadcrumb>

      {deleteSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setDeleteSuccessful(false)}
          dismissible
        >
          <strong>{props.history.location.state.deletedProvider}</strong> has
          been deleted.
        </Alert>
      ) : null}

      <Container>
        <h1 className="my-3">Providers</h1>
        <Container className="mt-2 mb-4 d-flex justify-content-between flex-wrap">
          <Container className="w-75 px-0 mx-0 mb-3">
            <Form.Control
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            ></Form.Control>
          </Container>

          <LinkContainer exact to="/settings/providers/new">
            <Button variant="outline-success" className="mb-3">
              <i className="fas fa-plus-circle"></i> New Provider
            </Button>
          </LinkContainer>
        </Container>
        <ProvidersTable query={query} />
      </Container>
    </>
  );
};

// #endregion

// #region Child Components

const Provider = ({ provider }) => (
  <LinkContainer
    exact
    to={`/settings/providers/${provider.providerId}`}
    className={"pointer"}
  >
    <tr>
      <td>{provider.fullName}</td>
      <td>{provider.email}</td>
      <td>{provider.phone}</td>
      <td>{provider.receiveReports ? "Yes" : "No"}</td>
    </tr>
  </LinkContainer>
);

const ProvidersTable = ({ query }) => {
  const { providers, providersLoading, providersError } = useProviders(false);

  if (providersLoading) return <Loading />;

  if (providersError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching providers.
      </p>
    );

  const providersList =
    query === ""
      ? providers
          .map((provider) => (
            <Provider key={provider.providerId} provider={provider} />
          ))
          .sort()
      : providers
          .filter(
            (provider) =>
              provider.fullName.toLowerCase().includes(query.toLowerCase()) ||
              provider.firstName.toLowerCase().includes(query.toLowerCase()) ||
              provider.lastName.toLowerCase().includes(query.toLowerCase()) ||
              provider.email.toLowerCase().includes(query.toLowerCase()) ||
              provider.phone.toLowerCase().includes(query.toLowerCase())
          )
          .map((provider) => (
            <Provider key={provider.providerId} provider={provider} />
          ))
          .sort();

  if (providersList === null) return null;

  return (
    <>
      {providersList.length > 0 ? (
        <Table responsive="md" striped hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Receive Reports?</th>
            </tr>
          </thead>
          <tbody>{providersList}</tbody>
        </Table>
      ) : (
        <p>
          <em>No providers found.</em>
        </p>
      )}
    </>
  );
};

// #endregion

export default Providers;
