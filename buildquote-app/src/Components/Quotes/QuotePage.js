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
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Link } from "react-router-dom";
import equal from "fast-deep-equal";

// Component imports
import Loading from "../../SubComponents/Loading";

// API imports
import useQuote from "../../API/useQuote";
import useProducts from "../../API/useProducts";

// #endregion

// #region QuotePage

const QuotePage = (props) => {
  const { quoteId } = useParams();
  const { quote, quoteLoading, quoteError, mutateQuote } = useQuote(quoteId);
  const { products, productsLoading, productsError } = useProducts(false);

  // Alert message displays.
  const [deleteError, setDeleteError] = useState(false);
  const [addSuccessful, setAddSuccessful] = useState(null);
  const [editSuccessful, setEditSuccessful] = useState(null);
  const [emailSuccessful, setEmailSuccessful] = useState(null);
  const [emailError, setEmailError] = useState(null);

  // Button disabler.
  const [disableButtons, setDisableButtons] = useState(false);

  // Modal window states.
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // History for redirect.
  let history = useHistory();

  // Functions.
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const handleDelete = async () => {
    setDisableButtons(true);

    await axios
      .delete(`/api/quotes/${quote.quoteId}`)
      .then(() =>
        history.push({
          pathname: `/quotes`,
          state: {
            deleteSuccessful: true,
            deletedQuote: `Quote #${quote.quoteNumber}`,
          },
        })
      )
      .catch(() => {
        setDeleteError(true);
        setDisableButtons(false);
        handleCloseDeleteModal();
      });
  };

  const handleCloseEmailModal = () => setShowEmailModal(false);
  const handleShowEmailModal = () => setShowEmailModal(true);

  const preEmailCheck = () => {
    if (quote.timeEmailed !== null) {
      handleShowEmailModal();
    } else sendCustomerEmail();
  };

  const sendCustomerEmail = async () => {
    setDisableButtons(true);

    await axios
      .post("/api/reports/sendtocustomer", { quoteId: quote.quoteId })
      .then((response) => {
        mutateQuote(response.data, false);
        setEmailSuccessful(true);
      })
      .catch(() => setEmailError(true))
      .finally(() => {
        setDisableButtons(false);
        handleCloseEmailModal();
      });
  };

  // Pre-render conditionals.
  if (addSuccessful === null && props.history.location.state?.addSuccessful)
    setAddSuccessful(true);
  if (editSuccessful === null && props.history.location.state?.editSuccessful)
    setEditSuccessful(true);

  if (quoteLoading || productsLoading) return <Loading />;

  if (quoteError || productsError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching quote.
      </p>
    );

  // Handle all the DateTime nonsense.
  const dateTimeCreated = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "short",
  }).format(new Date(quote.timeCreated));

  const dateTimeUpdated = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date(quote.timeLastUpdated));

  const dateTimeEmailed =
    quote.timeEmailed !== null
      ? new Intl.DateTimeFormat("en-GB", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(quote.timeEmailed))
      : "Never";

  return (
    <>
      <Helmet>
        <title>{`Quote #${quote.quoteNumber}`} | BuildQuote</title>
      </Helmet>

      <Breadcrumb
        className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}
      >
        <LinkContainer exact to="/">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer exact to="/quotes">
          <Breadcrumb.Item>Quotes</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Quote #{quote.quoteNumber}</Breadcrumb.Item>
      </Breadcrumb>

      {addSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setAddSuccessful(false)}
          dismissible
        >
          Quote added.
        </Alert>
      ) : null}

      {editSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setEditSuccessful(false)}
          dismissible
        >
          Quote details updated.
        </Alert>
      ) : null}

      {deleteError ? (
        <Alert
          variant="danger"
          onClose={() => setDeleteError(false)}
          dismissible
        >
          Error deleting quote. Please try again.
        </Alert>
      ) : null}

      {emailSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setEmailSuccessful(false)}
          dismissible
        >
          <strong>Quote #{quote.quoteNumber}</strong> has been emailed to{" "}
          <strong>{quote.customer.email}</strong>.
        </Alert>
      ) : null}

      {emailError ? (
        <Alert
          variant="danger"
          onClose={() => setEmailError(false)}
          dismissible
        >
          Error emailing quote. Please try again.
        </Alert>
      ) : null}

      <Container>
        <h1>Quote #{quote.quoteNumber}</h1>
        <Button
          disabled={
            disableButtons ||
            quote.customerId === null ||
            quote.providerId === null
          }
          variant="outline-primary"
          onClick={() => preEmailCheck()}
        >
          <i className="fas fa-envelope"></i> Email to Customer
        </Button>
        <Table className="w-auto">
          <tbody>
            <tr>
              <th>Date Created</th>
              <td>{dateTimeCreated}</td>
            </tr>
            <tr>
              <th>Customer</th>
              <td>
                {quote.customerId !== null ? (
                  <Link to={`/customers/${quote.customer.customerId}`}>
                    {quote.customer.fullName}
                  </Link>
                ) : (
                  <em>None</em>
                )}
              </td>
            </tr>
            <tr>
              <th>Provider</th>
              <td>
                {quote.providerId !== null ? (
                  <Link to={`/settings/providers/${quote.provider.providerId}`}>
                    {quote.provider.fullName}
                  </Link>
                ) : (
                  <em>None</em>
                )}
              </td>
            </tr>
            <tr>
              <th>Emailed</th>
              <td>
                {quote.timeEmailed !== null ? (
                  <>
                    <i className="fas fa-check text-success"></i>{" "}
                    {dateTimeEmailed}
                  </>
                ) : (
                  <i className="fas fa-times text-danger"></i>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
        <h2>
          Products (
          {quote.quoteProducts.reduce(
            (accum, item) => accum + item.quantity,
            0
          )}
          )
        </h2>
        <ProductsTable quote={quote} products={products} />
        <p>
          <em>Last updated: {dateTimeUpdated}</em>
        </p>
        <LinkContainer exact to={`./${quote.quoteId}/edit`}>
          <Button disabled={disableButtons} variant="secondary">
            <i className="fas fa-pencil-alt"></i> Edit
          </Button>
        </LinkContainer>{" "}
        <Button
          disabled={disableButtons}
          variant="danger"
          onClick={handleShowDeleteModal}
        >
          <i className="fas fa-trash-alt"></i> Delete
        </Button>
      </Container>

      <Modal
        show={showEmailModal}
        onHide={handleCloseEmailModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm re-send</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This quote was already emailed to the customer on{" "}
          <strong>{dateTimeEmailed}</strong>.
          <br />
          Are you sure you want to resend it?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            disabled={disableButtons}
            onClick={sendCustomerEmail}
          >
            {disableButtons ? <Loading /> : "Send"}
          </Button>
          <Button
            variant="outline-secondary"
            disabled={disableButtons}
            onClick={handleCloseEmailModal}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>Quote #{quote.quoteNumber}</strong>?<br />
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
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// #endregion

// #region Child Components

const ProductsTable = ({ quote, products }) => {
  const productsList =
    quote.quoteProducts != null
      ? quote.quoteProducts.map((qp) => (
          <Product
            key={qp.quoteProductId}
            quoteProduct={qp}
            products={products}
          />
        ))
      : null;

  if (productsList === null) return null;

  return (
    <>
      {productsList.length > 0 ? (
        <Table responsive="md">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Line Price</th>
              <th>Line VAT</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {productsList}
            <tr style={{ backgroundColor: "#212529", color: "#fff" }}>
              <td colSpan={3}>
                <strong>Totals</strong>
              </td>
              <td>&pound;{quote.netPrice.toFixed(2)}</td>
              <td>&pound;{quote.totalVat.toFixed(2)}</td>
              <td>
                <strong>&pound;{quote.grandTotal.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p>
          <em>No products assigned to this quote.</em>
        </p>
      )}
    </>
  );
};

const Product = ({ quoteProduct, products }) => {
  // Tooltip for when a product's been delisted.
  const renderDelistedWarning = (props) => (
    <Tooltip {...props}>This product has been delisted.</Tooltip>
  );

  // Tooltip for when a product's been altered.
  const renderOutdatedWarning = (props) => (
    <Tooltip {...props}>
      This product's details have changed since this quote was created.
    </Tooltip>
  );

  // Check whether this product still exists in the Products table.
  const productListing = products.filter(
    (p) => p.productId === quoteProduct.productId
  )[0];

  // If it doesn't exist, show the red warning and render stuff using its quoteProductId.
  if (productListing === undefined) {
    return (
      <tr>
        <td>
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderDelistedWarning}
          >
            <i className="fas fa-exclamation-circle text-danger"></i>
          </OverlayTrigger>{" "}
          {quoteProduct.name}
        </td>
        <td>&pound;{quoteProduct.overallPrice.toFixed(2)}</td>
        <td>{quoteProduct.quantity}</td>
        <td>&pound;{quoteProduct.linePrice.toFixed(2)}</td>
        <td>&pound;{quoteProduct.lineVat.toFixed(2)}</td>
        <td>&pound;{quoteProduct.lineTotal.toFixed(2)}</td>
      </tr>
    );
  }

  // Now compare the product listing to the quote product's details.
  // Only values that affect the quote are compared.
  const detailsMatch = equal(
    {
      name: productListing.name,
      unitPrice: productListing.unitPrice,
      vatRate: productListing.vatRate,
    },
    {
      name: quoteProduct.name,
      unitPrice: quoteProduct.unitPrice,
      vatRate: productListing.vatRate,
    }
  );

  // If the details don't match, that means the product listing has changed.
  // Show a yellow warning but still use the productId for rendering stuff.
  if (!detailsMatch) {
    return (
      <LinkContainer
        exact
        to={`/products/${quoteProduct.productId}`}
        className={"pointer"}
      >
        <tr>
          <td>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={renderOutdatedWarning}
            >
              <i className="fas fa-exclamation-circle text-warning"></i>
            </OverlayTrigger>{" "}
            {quoteProduct.name}
          </td>
          <td>&pound;{quoteProduct.overallPrice.toFixed(2)}</td>
          <td>{quoteProduct.quantity}</td>
          <td>&pound;{quoteProduct.linePrice.toFixed(2)}</td>
          <td>&pound;{quoteProduct.lineVat.toFixed(2)}</td>
          <td>&pound;{quoteProduct.lineTotal.toFixed(2)}</td>
        </tr>
      </LinkContainer>
    );

    // Otherwise, the quote product still matches its product listing. Render as normal.
  } else {
    return (
      <LinkContainer
        exact
        to={`/products/${quoteProduct.productId}`}
        className={"pointer"}
      >
        <tr>
          <td>{quoteProduct.name}</td>
          <td>&pound;{quoteProduct.overallPrice.toFixed(2)}</td>
          <td>{quoteProduct.quantity}</td>
          <td>&pound;{quoteProduct.linePrice.toFixed(2)}</td>
          <td>&pound;{quoteProduct.lineVat.toFixed(2)}</td>
          <td>&pound;{quoteProduct.lineTotal.toFixed(2)}</td>
        </tr>
      </LinkContainer>
    );
  }
};

// #endregion

export default QuotePage;
