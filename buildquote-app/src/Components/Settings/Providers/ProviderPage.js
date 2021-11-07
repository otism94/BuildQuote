// #region Imports

// Library imports
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  Alert,
  Breadcrumb,
  Button,
  Container,
  Modal,
  Table,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";

// Component imports
import Loading from "../../../SubComponents/Loading";

// API imports
import useProvider from "../../../API/useProvider";
import axios from "axios";

// #endregion

// #region ProviderPage

const ProviderPage = (props) => {
  const { providerId } = useParams();
  const { provider, providerLoading, providerError } = useProvider(
    providerId,
    true
  );

  // Alert message displays.
  const [deleteError, setDeleteError] = useState(false);
  const [addSuccessful, setAddSuccessful] = useState(null);
  const [editSuccessful, setEditSuccessful] = useState(null);

  // Button disabler.
  const [disableButtons, setDisableButtons] = useState(false);

  // Modal delete confirmation window.
  const [showModal, setShowModal] = useState(false);

  // History for redirect.
  let history = useHistory();

  if (addSuccessful === null && props.history.location.state?.addSuccessful)
    setAddSuccessful(true);
  if (editSuccessful === null && props.history.location.state?.editSuccessful)
    setEditSuccessful(true);

  if (providerLoading) return <Loading />;

  if (providerError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching provider.
      </p>
    );

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleDelete = async () => {
    setDisableButtons(true);

    await axios
      .delete(`/api/providers/${provider.providerId}`)
      .then(() =>
        history.push({
          pathname: `/settings/providers`,
          state: {
            deleteSuccessful: true,
            deletedProvider: provider.fullName,
          },
        })
      )
      .catch(() => {
        setDeleteError(true);
        setDisableButtons(false);
        handleClose();
      });
  };

  return (
    <>
      <Helmet>
        <title>
          {provider.firstName} {provider.lastName} | BuildQuote
        </title>
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
        <LinkContainer exact to="/settings/providers">
          <Breadcrumb.Item>Providers</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>{provider.fullName}</Breadcrumb.Item>
      </Breadcrumb>

      {addSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setAddSuccessful(false)}
          dismissible
        >
          Provider added.
        </Alert>
      ) : null}

      {editSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setEditSuccessful(false)}
          dismissible
        >
          Provider details updated.
        </Alert>
      ) : null}

      {deleteError ? (
        <Alert
          variant="danger"
          onClose={() => setDeleteError(false)}
          dismissible
        >
          Error deleting provider. Please try again.
        </Alert>
      ) : null}

      <Container>
        <h1>
          {provider.firstName} {provider.lastName}
        </h1>
        <Table className="w-auto">
          <tbody>
            <tr>
              <th>First Name</th>
              <td>{provider.firstName}</td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td>{provider.lastName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>
                <a href={`mailto:${provider.email}`}>{provider.email}</a>
              </td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>
                <a href={`tel:${provider.phone}`}>{provider.phone}</a>
              </td>
            </tr>
            <tr>
              <th>Reports</th>
              <td>{provider.receiveReports ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </Table>
        <h2>
          Quotes{" "}
          <LinkContainer
            exact
            to={{
              pathname: "/quotes/new",
              state: { presetProvider: provider.providerId },
            }}
          >
            <Button variant="outline-primary">New</Button>
          </LinkContainer>
        </h2>
        <Table striped hover>
          <thead>
            <tr>
              <th>Quote</th>
              <th>Date Created</th>
              <th>Total Price</th>
              <th>Emailed?</th>
            </tr>
          </thead>
          <tbody>
            {provider.quotes.length > 0 ? (
              provider.quotes.map((quote) => (
                <LinkContainer
                  key={quote.quoteId}
                  exact
                  to={`/quotes/${quote.quoteId}`}
                  className={"pointer"}
                >
                  <tr>
                    <td>#{quote.quoteNumber}</td>
                    <td>
                      {new Intl.DateTimeFormat("en-GB").format(
                        new Date(quote.timeCreated)
                      )}
                    </td>
                    <td>&pound;{quote.grandTotal.toFixed(2)}</td>
                    <td>
                      {quote.timeEmailed !== null ? (
                        <i className="fas fa-check text-success"></i>
                      ) : (
                        <i className="fas fa-times text-danger"></i>
                      )}
                    </td>
                  </tr>
                </LinkContainer>
              ))
            ) : (
              <tr colSpan={5}>
                <em>No quotes found.</em>
              </tr>
            )}
          </tbody>
        </Table>
        <LinkContainer exact to={`./${provider.providerId}/edit`}>
          <Button variant="secondary" disabled={disableButtons}>
            <i className="fas fa-pencil-alt"></i> Edit
          </Button>
        </LinkContainer>{" "}
        <Button variant="danger" disabled={disableButtons} onClick={handleShow}>
          <i className="fas fa-trash-alt"></i> Delete
        </Button>
      </Container>

      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{provider.fullName}</strong>?
          <br />
          This provider's quotes will <strong>not</strong> be affected.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            disabled={disableButtons}
            onClick={handleDelete}
          >
            {disableButtons ? <Loading /> : "Delete"}
          </Button>
          <Button
            variant="outline-secondary"
            disabled={disableButtons}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// #endregion

export default ProviderPage;
