//#region Imports

// Library imports
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import equal from "fast-deep-equal";

// Form imports
import { useForm } from "react-hook-form";
import axios from "axios";

// Component imports
import Loading from "../../SubComponents/Loading";

// API imports
import useQuote from "../../API/useQuote";
import useCustomers from "../../API/useCustomers";
import useProviders from "../../API/useProviders";
import useCategories from "../../API/useCategories";
import useProducts from "../../API/useProducts";

// Utilities
import { roundToTwoDecimals } from "../../Utilities/utilities";

//#endregion

const EditQuote = () => {
  //#region States

  // Local states.
  const [quoteProducts, setQuoteProducts] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [noProductsWarning, setNoProductsWarning] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [unchangedWarning, setUnchangedWarning] = useState(false);
  const [showMissingIdsModal, setShowMissingIdsModal] = useState(false);
  const [saveWithMissingIds, setSaveWithMissingIds] = useState(false);

  // quoteId from slug.
  const { quoteId } = useParams();

  // API states.
  const { quote, quoteLoading, quoteError, mutateQuote } = useQuote(quoteId);
  const { customers, customersLoading, customersError } = useCustomers();
  const { providers, providersLoading, providersError } = useProviders(false);
  const { categories, categoriesLoading, categoriesError } =
    useCategories(true);
  const { products, productsLoading, productsError } = useProducts(false);

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

  // Put the data into the API.
  const submitData = async (data) => {
    setDisableButtons(true);

    // Submit these values as null if they're empty strings.
    data.customerId = data.customerId === "" ? null : data.customerId;
    data.providerId = data.providerId === "" ? null : data.providerId;

    // Use quoteProducts state array as data's quote products.
    data.quoteProducts = quoteProducts;

    // Compare quote products in the data to the actual quoteProducts array from the API.
    // They need to get instantiated as QuoteProducts for fast-deep-equal for this to work.
    const productDataToCompare = [];
    quote.quoteProducts.forEach((qp) => {
      productDataToCompare.push(new QuoteProduct(qp));
    });

    if (
      equal(data, {
        customerId: quote.customerId,
        providerId: quote.providerId,
        quoteProducts: productDataToCompare,
      })
    ) {
      setDisableButtons(false);
      setUnchangedWarning(true);
      return;
    }

    // The quote's changed, so if it was previously emailed to the customer, set its timeEmailed value to null.
    if (quote.timeEmailed !== null) data.timeEmailed = null;

    mutateQuote({ ...data }, false);

    await axios
      .put(`/api/quotes/${quoteId}`, data)
      .then((response) => {
        mutateQuote({ ...response.data }, false);
        history.push({
          pathname: `/quotes/${response.data.quoteId}`,
          state: {
            addSuccessful: true,
          },
        });
      })
      .catch(() => {
        setSubmissionError(true);
        setDisableButtons(false);
      });
  };

  //#endregion

  //#region Pre-Render Conditionals

  if (
    quoteLoading ||
    customersLoading ||
    providersLoading ||
    categoriesLoading ||
    productsLoading
  )
    return <Loading />;

  if (
    quoteError ||
    customersError ||
    providersError ||
    categoriesError ||
    productsError
  )
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching data.
      </p>
    );

  if (quoteProducts === null && quote.quoteProducts.length > 0) {
    const preLoadedProducts = [];
    quote.quoteProducts.forEach((qp) =>
      preLoadedProducts.push(new QuoteProduct(qp))
    );
    setQuoteProducts(preLoadedProducts);
  } else if (quoteProducts === null) setQuoteProducts([]);

  //#endregion

  //#region Render

  return (
    <>
      <Helmet>
        <title>{`Editing Quote #${quote.quoteNumber}`} | BuildQuote</title>
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
        <LinkContainer exact to={`/quotes/${quote.quoteNumber}`}>
          <Breadcrumb.Item>Quote #{quote.quoteNumber}</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Edit</Breadcrumb.Item>
      </Breadcrumb>

      {submissionError ? (
        <Alert
          variant="danger"
          onClose={() => setSubmissionError(false)}
          dismissible
        >
          Error updating product. Please try again.
        </Alert>
      ) : null}

      {unchangedWarning ? (
        <Alert
          variant="warning"
          onClose={() => setUnchangedWarning(false)}
          dismissible
        >
          You haven't changed any values!
        </Alert>
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
        <h1>Editing Quote #{quote.quoteNumber}</h1>
        <Form noValidate onSubmit={handleSubmit(onSubmit)} id="quote-form">
          <CustomerFormDropdown
            defaultValue={quote.customerId}
            customers={customers}
            register={register}
            errors={errors.customerId}
          />
          <ProviderFormDropdown
            defaultValue={quote.providerId}
            providers={providers}
            register={register}
            errors={errors.providerId}
          />
          <h2>Products</h2>
          <ProductsTable
            categories={categories}
            products={products}
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
          <LinkContainer exact to={`/quotes/${quoteId}`}>
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

const CustomerFormDropdown = ({
  defaultValue,
  customers,
  register,
  errors,
}) => (
  <Form.Group controlId="customerId" className="mb-2">
    <Form.Label>Customer</Form.Label>
    <Form.Select
      isInvalid={!!errors}
      defaultValue={defaultValue}
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

const ProviderFormDropdown = ({
  defaultValue,
  providers,
  register,
  errors,
}) => (
  <Form.Group controlId="providerId" className="mb-2">
    <Form.Label>Provider</Form.Label>
    <Form.Select
      isInvalid={!!errors}
      defaultValue={defaultValue}
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

const ProductsTable = ({
  categories,
  products,
  quoteProducts,
  setQuoteProducts,
}) => {
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
  // Finds the correct object depending on whether a productId or quoteProductId is passed in.
  const handleQuantityChange = (
    productId = null,
    quoteProductId = null,
    newQuantity
  ) => {
    setQuoteProducts((prevState) => {
      const products = [...prevState];
      if (quoteProductId !== null) {
        products.find(
          (product) => product.quoteProductId === quoteProductId
        ).quantity = parseInt(newQuantity);
      } else if (productId !== null) {
        products.find((product) => product.productId === productId).quantity =
          parseInt(newQuantity);
      }
      return products;
    });
  };

  // Removes a product from the quoteProducts state array.
  // Finds the correct object depending on whether a productId or quoteProductId is passed in.
  const handleDeleteQuoteProduct = (
    productId = null,
    quoteProductId = null
  ) => {
    setQuoteProducts((prevState) => {
      if (quoteProductId !== null)
        return prevState.filter(
          (product) => product.quoteProductId !== quoteProductId
        );
      else if (productId !== null)
        return prevState.filter((product) => product.productId !== productId);
      else return prevState;
    });
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
              <QuoteProductRow
                key={qp.quoteProductId ? qp.quoteProductId : qp.productId}
                quoteProduct={qp}
                products={products}
                handleQuantityChange={handleQuantityChange}
                handleDeleteQuoteProduct={handleDeleteQuoteProduct}
                quantityFormOptions={quantityFormOptions}
              />
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

const QuoteProductRow = ({
  quoteProduct,
  products,
  handleQuantityChange,
  handleDeleteQuoteProduct,
  quantityFormOptions,
}) => {
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
        <td>
          <Form.Select
            defaultValue={quoteProduct.quantity}
            onChange={(e) =>
              handleQuantityChange(
                null,
                quoteProduct.quoteProductId,
                e.target.value
              )
            }
          >
            {quantityFormOptions()}
          </Form.Select>
        </td>
        <td>&pound;{quoteProduct.linePrice.toFixed(2)}</td>
        <td>&pound;{quoteProduct.lineVat.toFixed(2)}</td>
        <td>
          <strong>&pound;{quoteProduct.lineTotal.toFixed(2)}</strong>
        </td>
        <td>
          <i
            className="fas fa-trash text-danger pointer"
            onClick={() =>
              handleDeleteQuoteProduct(null, quoteProduct.quoteProductId)
            }
          ></i>
        </td>
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
        <td>
          <Form.Select
            defaultValue={quoteProduct.quantity}
            onChange={(e) =>
              handleQuantityChange(quoteProduct.productId, null, e.target.value)
            }
          >
            {quantityFormOptions()}
          </Form.Select>
        </td>
        <td>&pound;{quoteProduct.linePrice.toFixed(2)}</td>
        <td>&pound;{quoteProduct.lineVat.toFixed(2)}</td>
        <td>
          <strong>&pound;{quoteProduct.lineTotal.toFixed(2)}</strong>
        </td>
        <td>
          <i
            className="fas fa-trash text-danger pointer"
            onClick={() => handleDeleteQuoteProduct(quoteProduct.productId)}
          ></i>
        </td>
      </tr>
    );

    // Otherwise, the quote product still matches its product listing. Render as normal.
  } else {
    return (
      <tr>
        <td>{quoteProduct.name}</td>
        <td>&pound;{quoteProduct.overallPrice.toFixed(2)}</td>
        <td>
          <Form.Select
            defaultValue={quoteProduct.quantity}
            onChange={(e) =>
              handleQuantityChange(quoteProduct.productId, null, e.target.value)
            }
          >
            {quantityFormOptions()}
          </Form.Select>
        </td>
        <td>&pound;{quoteProduct.linePrice.toFixed(2)}</td>
        <td>&pound;{quoteProduct.lineVat.toFixed(2)}</td>
        <td>
          <strong>&pound;{quoteProduct.lineTotal.toFixed(2)}</strong>
        </td>
        <td>
          <i
            className="fas fa-trash text-danger pointer"
            onClick={() => handleDeleteQuoteProduct(quoteProduct.productId)}
          ></i>
        </td>
      </tr>
    );
  }
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
    this.quoteProductId = product.quoteProductId;
    this.productId = product.productId;
    this.categoryId = product.categoryId;
    this.name = product.name;
    this.unitPrice = product.unitPrice;
    this.vatRate = product.vatRate;
    this.overallPrice = product.overallPrice;
    this.quantity = product.quantity ? product.quantity : 1;
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

export default EditQuote;
