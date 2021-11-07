// #region Imports

// Library imports
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import { Alert, Breadcrumb, Button, Container, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";
import equal from "fast-deep-equal";

// Form imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

// Component imports
import Loading from "../../SubComponents/Loading";

// API imports
import useCustomer from "../../API/useCustomer";

// #endregion

// #region Form Schema

const schema = yup.object({
  firstName: yup.string().required("This field is required."),
  lastName: yup.string().required("This field is required."),
  addressLine1: yup.string().required("This field is required."),
  addressLine2: yup.string().nullable(),
  city: yup.string().required("This field is required."),
  postCode: yup
    .string()
    .required("This field is required.")
    .matches(
      /^(([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}$/,
      "Please enter a valid post code."
    ),
  email: yup
    .string()
    .required("This field is required.")
    .email("Please enter a valid email."),
  phone: yup
    .string()
    .required("This field is required.")
    .matches(
      /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?$/,
      "Please enter a valid UK phone number."
    ),
});

// #endregion

const EditCustomer = () => {
  // #region States

  // Local states
  const [disableButtons, setDisableButtons] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [unchangedWarning, setUnchangedWarning] = useState(false);

  //customerId from slug.
  const { customerId } = useParams();

  // History for redirect.
  let history = useHistory();

  // SWR state from the API for the customer.
  const { customer, customerLoading, customerError, mutateCustomer } =
    useCustomer(customerId);

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

    // Check whether values have actually changed before making API request.
    if (
      equal(data, {
        firstName: customer.firstName,
        lastName: customer.lastName,
        addressLine1: customer.addressLine1,
        addressLine2: customer.addressLine2,
        city: customer.city,
        postCode: customer.postCode,
        email: customer.email,
        phone: customer.phone,
      })
    ) {
      setDisableButtons(false);
      setUnchangedWarning(true);
      return;
    }

    // Convert addressLine2 to null if received as empty string.
    if (data.addressLine2 === "") data.addressLine2 = null;

    mutateCustomer({ ...data }, false);

    await axios
      .put(`/api/customers/${customer.customerId}`, data)
      .then((response) => {
        mutateCustomer({ ...response.data }, false);
        history.push({
          pathname: `/customers/${customer.customerId}`,
          state: {
            editSuccessful: true,
          },
        });
      })
      .catch(() => {
        setSubmissionError(true);
        setDisableButtons(false);
      });
  };

  // #endregion

  // #region Pre-Render Conditionals

  // Early return if data is being loaded from the API.
  if (customerLoading) return <Loading />;

  // Display error message if data fails to load (will retry 10 times).
  if (customerError)
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
        <title>
          Editing {customer.firstName} {customer.lastName} | BuildQuote
        </title>
      </Helmet>

      <Breadcrumb
        className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}
      >
        <LinkContainer exact to="/">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer exact to="/customers">
          <Breadcrumb.Item>Customers</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer exact to={`/customers/${customerId}`}>
          <Breadcrumb.Item>{customer.fullName}</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Edit</Breadcrumb.Item>
      </Breadcrumb>

      {submissionError ? (
        <Alert
          variant="danger"
          onClose={() => setSubmissionError(false)}
          dismissible
        >
          Error updating customer. Please try again.
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

      <Container>
        <h1>
          Editing {customer.firstName} {customer.lastName}
        </h1>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="firstName" className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Jean"
              defaultValue={customer.firstName}
              isInvalid={!!errors.firstName}
              {...register("firstName", { required: true })}
            />
            <p className="text-danger">{errors.firstName?.message}</p>
          </Form.Group>
          <Form.Group controlId="lastName" className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Smith"
              defaultValue={customer.lastName}
              isInvalid={!!errors.lastName}
              {...register("lastName", { required: true })}
            />
            <p className="text-danger">{errors.lastName?.message}</p>
          </Form.Group>
          <Form.Group controlId="addressLine1" className="mb-2">
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type="text"
              placeholder="123 Example Street"
              defaultValue={customer.addressLine1}
              isInvalid={!!errors.addressLine1}
              {...register("addressLine1", { required: true })}
            />
            <p className="text-danger">{errors.addressLine1?.message}</p>
          </Form.Group>
          <Form.Group controlId="addressLine2" className="mb-2">
            <Form.Label>Address Line 2 (optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Villageham"
              defaultValue={customer.addressLine2}
              isInvalid={!!errors.addressLine2}
              {...register("addressLine2")}
            />
            <p className="text-danger">{errors.addressLine2?.message}</p>
          </Form.Group>
          <Form.Group controlId="city" className="mb-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Townsville"
              defaultValue={customer.city}
              isInvalid={!!errors.city}
              {...register("city", { required: true })}
            />
            <p className="text-danger">{errors.city?.message}</p>
          </Form.Group>
          <Form.Group controlId="postCode" className="mb-2">
            <Form.Label>Post Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="AB1 2CD"
              defaultValue={customer.postCode}
              isInvalid={!!errors.postCode}
              {...register("postCode", { required: true })}
            />
            <p className="text-danger">{errors.postCode?.message}</p>
          </Form.Group>
          <Form.Group controlId="email" className="mb-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="email"
              placeholder="jeansmith@example.com"
              defaultValue={customer.email}
              isInvalid={!!errors.email}
              {...register("email", { required: true })}
            />
            <p className="text-danger">{errors.email?.message}</p>
          </Form.Group>
          <Form.Group controlId="phone" className="mb-2">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="01234 567890"
              defaultValue={customer.phone}
              isInvalid={!!errors.phone}
              {...register("phone", { required: true })}
            />
            <p className="text-danger">{errors.phone?.message}</p>
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
          <LinkContainer exact to={`/customers/${customer.customerId}`}>
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

export default EditCustomer;
