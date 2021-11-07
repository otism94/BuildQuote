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
import Loading from "../../SubComponents/Loading";

// API imports
import useProduct from "../../API/useProduct";
import axios from "axios";

// #endregion

// #region ProductPage

const ProductPage = (props) => {
  const { productId } = useParams();
  const { product, productLoading, productError } = useProduct(productId, true);

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

  if (productLoading) return <Loading />;

  if (productError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching product.
      </p>
    );

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleDelete = async () => {
    setDisableButtons(true);

    await axios
      .delete(`/api/products/${product.productId}`)
      .then(() =>
        history.push({
          pathname: `/products`,
          state: {
            deleteSuccessful: true,
            deletedProduct: product.name,
            presetCategory: product.categoryId,
          },
        })
      )
      .catch(() => {
        setDeleteError(true);
        setDisableButtons(false);
        handleClose();
      });
  };

  const dateTimeUpdated = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date(product.timeLastUpdated));

  return (
    <>
      <Helmet>
        <title>{product.name} | BuildQuote</title>
      </Helmet>

      <Breadcrumb
        className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}
      >
        <LinkContainer exact to="/">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer
          exact
          to={{
            pathname: "/products",
            state: { presetCategory: product.categoryId },
          }}
        >
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      {addSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setAddSuccessful(false)}
          dismissible
        >
          Product added.
        </Alert>
      ) : null}

      {editSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setEditSuccessful(false)}
          dismissible
        >
          Product details updated.
        </Alert>
      ) : null}

      {deleteError ? (
        <Alert
          variant="danger"
          onClose={() => setDeleteError(false)}
          dismissible
        >
          Error deleting product. Please try again.
        </Alert>
      ) : null}

      <Container>
        <h1>{product.name}</h1>
        <Table className="w-auto">
          <tbody>
            <tr>
              <th>Category</th>
              <td>{product.category.name}</td>
            </tr>
            <tr>
              <th>Unit Price</th>
              <td>&pound;{product.unitPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <th>VAT Rate</th>
              <td>{product.vatRate}%</td>
            </tr>
            <tr>
              <th>VAT Price</th>
              <td>&pound;{product.vatPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <th>Overall Price</th>
              <td>&pound;{product.overallPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
        <p>
          <em>Last updated: {dateTimeUpdated}</em>
        </p>
        <LinkContainer exact to={`./${product.productId}/edit`}>
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
          Are you sure you want to delete <strong>{product.name}</strong>?<br />
          Quotes containing this product will <strong>not</strong> be affected.
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

export default ProductPage;
