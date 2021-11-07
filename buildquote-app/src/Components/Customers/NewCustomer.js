// #region Imports

// Library imports
import { useState } from "react";
import { useHistory } from "react-router";
import { Alert, Breadcrumb, Button, Container, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";

// Form imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

// Component imports
import Loading from "../../SubComponents/Loading";

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

const NewCustomer = () => {
  // #region States

  // Local states
  const [disableButtons, setDisableButtons] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  // History for redirect.
  let history = useHistory();

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

    // Convert addressLine2 to null if received as empty string.
    if (data.addressLine2 === "") data.addressLine2 = null;

    await axios
      .post("/api/customers/new", data)
      .then((response) =>
        history.push({
          pathname: `/customers/${response.data.customerId}`,
          state: {
            addSuccessful: true,
          },
        })
      )
      .catch((error) => {
        setSubmissionError(true);
        setDisableButtons(false);
      });
  };

  // #endregion

  // #region Render

  return (
    <>
      <Helmet>
        <title>New Customer | BuildQuote</title>
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
        <Breadcrumb.Item active>New</Breadcrumb.Item>
      </Breadcrumb>

      {submissionError ? (
        <Alert
          variant="danger"
          onClose={() => setSubmissionError(false)}
          dismissible
        >
          Error adding customer. Please try again.
        </Alert>
      ) : null}

      <Container>
        <h1>New Customer</h1>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="firstName" className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Jean"
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
              isInvalid={!!errors.postCode}
              {...register("postCode", { required: true })}
            />
            <p className="text-danger">{errors.postCode?.message}</p>
          </Form.Group>
          <Form.Group controlId="email" className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="jeansmith@example.com"
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
          <LinkContainer exact to="/customers">
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

export default NewCustomer;
