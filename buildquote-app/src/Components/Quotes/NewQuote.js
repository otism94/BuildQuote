//#region Imports

// Library imports
import { useState } from "react";
import { useHistory } from "react-router";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

// Form imports
import { useForm } from "react-hook-form";
import axios from "axios";

// Component imports
import Loading from "../../SubComponents/Loading";

// API imports
import useCustomers from "../../API/useCustomers";
import useProviders from "../../API/useProviders";
import useCategories from "../../API/useCategories";

// Utilities
import { roundToTwoDecimals } from "../../Utilities/utilities";

//#endregion

const NewQuote = (props) => {
  //#region States

  // API states.
  const { customers, customersLoading, customersError } = useCustomers();
  const { providers, providersLoading, providersError } = useProviders(false);
  const { categories, categoriesLoading, categoriesError } =
    useCategories(true);

  // Local states.
  const [quoteProducts, setQuoteProducts] = useState([]);
  const [disableButtons, setDisableButtons] = useState(false);
  const [noProductsWarning, setNoProductsWarning] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [showMissingIdsModal, setShowMissingIdsModal] = useState(false);
  const [saveWithMissingIds, setSaveWithMissingIds] = useState(false);

  // History for redirect.
  let history = useHistory();

  //#endregion

  //#region Form Handling

  // react-hook-forms state.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
  });

  // Called on form submit.
  // Checks whether there's any products, then whether the customer/provider is missing, then actually posts the data.
  const onSubmit = (data) => {
    if (quoteProducts.length < 1) setNoProductsWarning(true);
    else if (
      saveWithMissingIds === false &&
      (data.customerId === "" || data.providerId === "")
    )
      setShowMissingIdsModal(true);
    else submitData(data);
  };

  // Post the data to the API.
  const submitData = async (data) => {
    setDisableButtons(true);

    // Submit these values as null if they're empty strings.
    data.customerId = data.customerId === "" ? null : data.customerId;
    data.providerId = data.providerId === "" ? null : data.providerId;

    // Use quoteProducts state array as data's quote products.
    data.quoteProducts = quoteProducts;

    await axios
      .post("/api/quotes/new", data)
      .then((response) =>
        history.push({
          pathname: `/quotes/${response.data.quoteId}`,
          state: {
            addSuccessful: true,
          },
        })
      )
      .catch(() => {
        setSubmissionError(true);
        setDisableButtons(false);
      });
  };

  //#endregion

  //#region Pre-Render Conditionals

  if (customersLoading || providersLoading || categoriesLoading)
    return <Loading />;

  if (customersError || providersError || categoriesError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching data.
      </p>
    );

  //#endregion

  //#region Render

  return (
    <>
      <Helmet>
        <title>New Quote | BuildQuote</title>
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
        <Breadcrumb.Item active>New</Breadcrumb.Item>
      </Breadcrumb>

      {submissionError ? (
        <Alert variant="danger">Error adding product. Please try again.</Alert>
      ) : null}

      {noProductsWarning ? (
        <Alert
          variant="warning"
          onClose={() => setNoProductsWarning(false)}
          dismissible
        >
          You haven't added any products!
        </Alert>
      ) : null}

      <Container>
        <h1>New Quote</h1>
        <Form noValidate onSubmit={handleSubmit(onSubmit)} id="quote-form">
          <CustomerFormDropdown
            props={props}
            customers={customers}
            register={register}
            errors={errors.customerId}
          />
          <ProviderFormDropdown
            props={props}
            providers={providers}
            register={register}
            errors={errors.providerId}
          />
          <h2>
            Products (
            {quoteProducts.reduce((accum, item) => accum + item.quantity, 0)})
          </h2>
          <ProductsTable
            categories={categories}
            quoteProducts={quoteProducts}
            setQuoteProducts={setQuoteProducts}
          />
          <Button
            variant="success"
            type="submit"
            className="mt-3"
            disabled={disableButtons}
          >
            {disableButtons ? (
              <Loading />
            ) : (
              <>
                <i className="fas fa-save"></i> Save
              </>
            )}
          </Button>{" "}
          <LinkContainer exact to="/quotes">
            <Button
              variant="secondary"
              className="mt-3"
              disabled={disableButtons}
            >
              Cancel
            </Button>
          </LinkContainer>
        </Form>
      </Container>

      <Modal
        show={showMissingIdsModal}
        onHide={() => setShowMissingIdsModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Missing data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <strong>
            You are about to save a quote without supplying customer or provider
            information.{" "}
          </strong>
          You can add these details later, but it won't be sent in email reports
          until both are provided.
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            form="quote-form"
            variant="warning"
            onClick={() => {
              setSaveWithMissingIds(true);
            }}
          >
            Understood
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowMissingIdsModal(false);
              setSaveWithMissingIds(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

  //#endregion
};

//#region Customer/Provider Components

const CustomerFormDropdown = ({ props, customers, register, errors }) => (
  <Form.Group controlId="customerId" className="mb-2">
    <Form.Label>Customer</Form.Label>
    <Form.Select
      isInvalid={!!errors}
      defaultValue={
        props.history.location.state?.presetCustomer
          ? props.history.location.state?.presetCustomer
          : ""
      }
      {...register("customerId")}
    >
      <option value="">Select a customer</option>
      {customers.map((customer) => (
        <option key={customer.customerId} value={customer.customerId}>
          {customer.fullName}
        </option>
      ))}
    </Form.Select>
    <p className="text-danger">{errors?.message}</p>
    <p>
      <em>
        Can't find the right customer? You can{" "}
        <Link to="/customers/new">add a new one here.</Link>
      </em>
    </p>
  </Form.Group>
);

const ProviderFormDropdown = ({ props, providers, register, errors }) => (
  <Form.Group controlId="providerId" className="mb-2">
    <Form.Label>Provider</Form.Label>
    <Form.Select
      isInvalid={!!errors}
      defaultValue={
        props.history.location.state?.presetProvider
          ? props.history.location.state?.presetProvider
          : ""
      }
      {...register("providerId")}
    >
      <option value="">Select a provider</option>
      {providers.map((provider) => (
        <option key={provider.providerId} value={provider.providerId}>
          {provider.fullName}
        </option>
      ))}
    </Form.Select>
    <p className="text-danger">{errors?.message}</p>
  </Form.Group>
);

//#endregion

//#region Product Components

const ProductsTable = ({ categories, quoteProducts, setQuoteProducts }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [disableAddButton, setDisableAddButton] = useState(true);

  // Adds a new product to the quoteProducts state array.
  const handleAddProduct = () => {
    const productToAdd = [].concat
      .apply(
        [],
        categories.map((category) => category.products)
      )
      .find((product) => product.productId === selectedProduct);

    setQuoteProducts((prevState) => [
      ...prevState,
      new QuoteProduct(productToAdd),
    ]);

    setSelectedProduct("");
  };

  // Updates the matching object in quoteProducts' quantity value.
  const handleQuantityChange = (id, newQuantity) => {
    setQuoteProducts((prevState) => {
      const products = [...prevState];
      products.find((product) => product.productId === id).quantity =
        parseInt(newQuantity);
      return products;
    });
  };

  // Removes a product from the quoteProducts state array.
  const handleDeleteQuoteProduct = (id) => {
    setQuoteProducts((prevState) =>
      prevState.filter((product) => product.productId !== id)
    );
  };

  // Quantity dropdown options (1-99).
  const quantityFormOptions = () => {
    let options = [];

    for (let i = 1; i <= 99; i++)
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );

    return options;
  };

  // Make sure the Add button is disabled when no product's selected in the dropdown.
  if (selectedProduct === "" && !disableAddButton) setDisableAddButton(true);
  else if (selectedProduct !== "" && disableAddButton)
    setDisableAddButton(false);

  return (
    <>
      <Row>
        <Col>
          <ProductFormDropdown
            categories={categories}
            quoteProducts={quoteProducts}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        </Col>
        <Col>
          <Button
            variant="outline-primary"
            disabled={disableAddButton}
            onClick={handleAddProduct}
          >
            Add
          </Button>
        </Col>
      </Row>
      <Table responsive="md">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Line Price</th>
            <th>Line VAT</th>
            <th>Line Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quoteProducts.length === 0 ? (
            <tr>
              <td colSpan={7}>No products yet.</td>
            </tr>
          ) : (
            quoteProducts.map((qp) => (
              <tr key={qp.productId}>
                <td>{qp.name}</td>
                <td>&pound;{qp.overallPrice.toFixed(2)}</td>
                <td>
                  <Form.Select
                    defaultValue={1}
                    onChange={(e) =>
                      handleQuantityChange(qp.productId, e.target.value)
                    }
                  >
                    {quantityFormOptions()}
                  </Form.Select>
                </td>
                <td>&pound;{qp.linePrice.toFixed(2)}</td>
                <td>&pound;{qp.lineVat.toFixed(2)}</td>
                <td>
                  <strong>&pound;{qp.lineTotal.toFixed(2)}</strong>
                </td>
                <td>
                  <i
                    className="fas fa-trash text-danger pointer"
                    onClick={() => handleDeleteQuoteProduct(qp.productId)}
                  ></i>
                </td>
              </tr>
            ))
          )}
          <tr style={{ backgroundColor: "#212529", color: "#fff" }}>
            <td colSpan={3}>
              <strong>Totals</strong>
            </td>
            <td>
              &pound;
              {quoteProducts
                .reduce((accum, item) => accum + item.linePrice, 0)
                .toFixed(2)}
            </td>
            <td>
              &pound;
              {quoteProducts
                .reduce((accum, item) => accum + item.lineVat, 0)
                .toFixed(2)}
            </td>
            <td>
              <strong>
                &pound;
                {quoteProducts
                  .reduce((accum, item) => accum + item.lineTotal, 0)
                  .toFixed(2)}
              </strong>
            </td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

const ProductFormDropdown = ({
  categories,
  quoteProducts,
  selectedProduct,
  setSelectedProduct,
}) => (
  <Form.Select
    value={selectedProduct}
    onChange={(e) => setSelectedProduct(e.target.value)}
  >
    <option value="">Select a product</option>
    {categories
      .filter((category) => category.products.length > 0)
      .map((category) => (
        <optgroup key={category.categoryId} label={category.name}>
          {category.products.map((product) => (
            <option
              key={product.productId}
              value={product.productId}
              disabled={quoteProducts.find(
                (qp) => qp.productId === product.productId
              )}
            >
              {product.name}
            </option>
          ))}
        </optgroup>
      ))}
  </Form.Select>
);

//#endregion

//#region QuoteProduct Class

class QuoteProduct {
  constructor(product) {
    this.productId = product.productId;
    this.categoryId = product.categoryId;
    this.name = product.name;
    this.unitPrice = product.unitPrice;
    this.vatRate = product.vatRate;
    this.overallPrice = product.overallPrice;
    this.quantity = 1;
  }

  get linePrice() {
    return roundToTwoDecimals(this.unitPrice * this.quantity);
  }

  get lineVat() {
    return roundToTwoDecimals(
      (this.vatRate / 100) * this.unitPrice * this.quantity
    );
  }

  get lineTotal() {
    return roundToTwoDecimals(this.linePrice + this.lineVat);
  }
}

//#endregion

export default NewQuote;
