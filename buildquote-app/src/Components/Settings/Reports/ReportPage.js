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
import useReport from "../../../API/useReport";
import axios from "axios";

// #endregion

// #region ReportPage

const ReportPage = (props) => {
  const { reportId } = useParams();
  const { report, reportLoading, reportError } = useReport(reportId);

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

  if (reportLoading) return <Loading />;

  if (reportError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching report.
      </p>
    );

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleDelete = async () => {
    setDisableButtons(true);

    await axios
      .delete(`/api/reports/${report.reportId}`)
      .then(() =>
        history.push({
          pathname: `/settings/reports`,
          state: {
            deleteSuccessful: true,
            deletedReport: new Intl.DateTimeFormat("en-GB", {
              dateStyle: "short",
            }).format(new Date(report.reportDate)),
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
          Report for{" "}
          {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "short",
          }).format(new Date(report.reportDate))}{" "}
          | BuildQuote
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
        <LinkContainer exact to="/settings/reports">
          <Breadcrumb.Item>Reports</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>
          Report for{" "}
          {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "short",
          }).format(new Date(report.reportDate))}
        </Breadcrumb.Item>
      </Breadcrumb>

      {deleteError ? (
        <Alert
          variant="danger"
          onClose={() => setDeleteError(false)}
          dismissible
        >
          Error deleting report. Please try again.
        </Alert>
      ) : null}

      <Container>
        <h1>
          Report for{" "}
          {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "short",
          }).format(new Date(report.reportDate))}
        </h1>
        <Table className="w-auto">
          <tbody>
            <tr>
              <th>Quotes Emailed</th>
              <td>{report.quotesCount}</td>
            </tr>
            <tr>
              <th>Sub-Total</th>
              <td>&pound;{report.netTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Total VAT</th>
              <td>&pound;{report.totalVat.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Grand Total</th>
              <td>&pound;{report.grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
        <h2>Quotes </h2>
        <Table striped hover>
          <thead>
            <tr>
              <th>Quote</th>
              <th>Provider</th>
              <th>Customer</th>
              <th>Net Price</th>
              <th>Net VAT</th>
              <th>Net Total</th>
            </tr>
          </thead>
          <tbody>
            {report.quotes.length > 0 ? (
              report.quotes.map((quote) => (
                <LinkContainer
                  key={quote.quoteId}
                  exact
                  to={`/quotes/${quote.quoteId}`}
                  className={"pointer"}
                >
                  <tr>
                    <td>#{quote.quoteNumber}</td>
                    <td>{quote.providerName}</td>
                    <td>{quote.customerName}</td>
                    <td>&pound;{quote.netPrice.toFixed(2)}</td>
                    <td>&pound;{quote.totalVat.toFixed(2)}</td>
                    <td>&pound;{quote.grandTotal.toFixed(2)}</td>
                  </tr>
                </LinkContainer>
              ))
            ) : (
              <tr colSpan={5}>
                <em>No quotes were emailed on this date.</em>
              </tr>
            )}
          </tbody>
        </Table>
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
          Are you sure you want to delete{" "}
          <strong>
            Report for{" "}
            {new Intl.DateTimeFormat("en-GB", {
              dateStyle: "short",
            }).format(new Date(report.reportDate))}
          </strong>
          ?
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

export default ReportPage;
