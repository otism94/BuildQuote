// #region Imports

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
  InputGroup,
  Row,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";

// Form imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

// Component imports
import Loading from "../../SubComponents/Loading";

// API imports
import useCategories from "../../API/useCategories";

// Utilities
import { roundToTwoDecimals } from "../../Utilities/utilities";

// #endregion

// #region Form Schema

const schema = yup.object({
  name: yup
    .string()
    .required("This field is required.")
    .min(3, "Name must be at least 3 characters long."),
  categoryId: yup.string().required("This field is required."),
  unitPrice: yup
    .number()
    .required("This field is required.")
    .typeError("Please enter a price.")
    .min(0, "Unit price must be £0 or more.")
    .test("maxDigitsAfterDecimal", "Please enter a valid price.", (number) =>
      /^\d+(\.\d{1,2})?$/.test(number)
    ),
  vatRate: yup
    .number()
    .required("This field is required.")
    .typeError("Please enter a number.")
    .min(0, "VAT rate must be 0% or more."),
});

// #endregion

const NewProduct = (props) => {
  // #region States

  // Local states
  // Stores values for computed data (unitPrice and vatRate => vatPrice and overallPrice).
  // This won't be posted to the database, it's just for UX.
  const [preComputedPrices, setPreComputedPrices] = useState({
    unitPrice: 0,
    vatRate: 20,
  });
  const [computedPrices, setComputedPrices] = useState({
    vatPrice: null,
    overallPrice: null,
  });

  const [disableButtons, setDisableButtons] = useState(false);

  const [submissionError, setSubmissionError] = useState(false);

  // History for redirect.
  let history = useHistory();

  // SWR state from the API for the categories.
  const { categories, categoriesLoading, categoriesError } =
    useCategories(false);

  // #endregion

  // #region Form Handling

  // react-hooks-form state.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  // onSubmit handler.
  const onSubmit = async (data) => {
    setDisableButtons(true);

    data.unitPrice = parseFloat(data.unitPrice);
    data.vatRate = parseFloat(data.vatRate);

    await axios
      .post("/api/products/new", data)
      .then((response) =>
        history.push({
          pathname: `/products/${response.data.productId}`,
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

  // #endregion

  // #region Functions

  /**
   * Updates the preComputedPrices state for the changed field's matching property and calls updateComputedDetails.
   * @param {event} e onChange event.
   */
  const handleChange = (e) => {
    let name = e.target.name;
    let value = parseFloat(e.target.value);

    const newValues = {
      ...preComputedPrices,
      [name]: value,
    };

    setPreComputedPrices(newValues);
    updateComputedDetails(newValues);
  };

  /**
   * Calculates computed properties (vatPrice and overallPrice) and updates the computedPrices state.
   * @param {object} newValues Object containing the new unitPrice and vatRate.
   */
  const updateComputedDetails = (newValues) => {
    const { unitPrice, vatRate } = newValues;

    let newVatPrice = roundToTwoDecimals((vatRate / 100) * unitPrice);
    let newOverallPrice = roundToTwoDecimals(newVatPrice + unitPrice);

    setComputedPrices({
      vatPrice: newVatPrice,
      overallPrice: newOverallPrice,
    });
  };

  // #endregion

  // #region Pre-Render Conditionals

  // Early return if data is being loaded from the API.
  if (categoriesLoading) return <Loading />;

  // Display error message if data fails to load (will retry 10 times).
  if (categoriesError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching data.
      </p>
    );

  // #endregion

  // #region Render

  return (
    <>
      <Helmet>
        <title>New Product | BuildQuote</title>
      </Helmet>

      <Breadcrumb
        className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}
      >
        <LinkContainer exact to="/">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer exact to="/products">
          <Breadcrumb.Item>Products</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>New</Breadcrumb.Item>
      </Breadcrumb>

      {submissionError ? (
        <Alert variant="danger">Error adding product. Please try again.</Alert>
      ) : null}

      <Container>
        <h1>New Product</h1>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="name" className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a product name"
              isInvalid={!!errors.name}
              {...register("name", { required: true, minLength: 3 })}
            />
            <p className="text-danger">{errors.name?.message}</p>
          </Form.Group>
          <Form.Group controlId="categoryId" className="mb-2">
            <Form.Label>Category</Form.Label>
            <Form.Select
              isInvalid={!!errors.categoryId}
              defaultValue={
                props.history.location.state?.presetCategory
                  ? props.history.location.state.presetCategory
                  : ""
              }
              {...register("categoryId", { required: true })}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
            <p className="text-danger">{errors.categoryId?.message}</p>
          </Form.Group>
          <Row>
            <Form.Group
              as={Col}
              controlId="unitPrice"
              className="mb-2"
              onChange={handleChange}
            >
              <Form.Label>Unit Price</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text>£</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Enter a unit price"
                  step=".01"
                  isInvalid={!!errors.unitPrice}
                  {...register("unitPrice", { required: true, min: 0 })}
                />
              </InputGroup>
              <p className="text-danger">{errors.unitPrice?.message}</p>
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="vatRate"
              className="mb-2"
              onChange={handleChange}
            >
              <Form.Label>VAT Rate</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="number"
                  placeholder="Enter a VAT rate"
                  defaultValue={20}
                  step=".5"
                  isInvalid={!!errors.vatRate}
                  {...register("vatRate", { required: true, min: 0 })}
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
              <p className="text-danger">{errors.vatRate?.message}</p>
            </Form.Group>
          </Row>
          <Form.Group controlId="readonly_vatPrice" className="mb-2">
            <Form.Label>VAT Price</Form.Label>
            <InputGroup>
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                readOnly
                value={
                  computedPrices.vatPrice !== null
                    ? `${computedPrices.vatPrice.toFixed(2)}`
                    : ""
                }
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="readonly_overallPrice" className="mb-2">
            <Form.Label>Overall Price</Form.Label>
            <InputGroup>
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                readOnly
                value={
                  computedPrices.overallPrice !== null
                    ? `${computedPrices.overallPrice.toFixed(2)}`
                    : ""
                }
              />
            </InputGroup>
          </Form.Group>
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
          <LinkContainer exact to="/products">
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
    </>
  );

  // #endregion
};

export default NewProduct;
