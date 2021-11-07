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
import Loading from "../../../SubComponents/Loading";

// API imports
import useProvider from "../../../API/useProvider";

// #endregion

// #region Form Schema

const schema = yup.object({
  firstName: yup.string().required("This field is required."),
  lastName: yup.string().required("This field is required."),
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

const EditProvider = () => {
  // #region States

  // Local states
  const [reportsChecked, setReportsChecked] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  const [unchangedWarning, setUnchangedWarning] = useState(false);

  //providerId from slug.
  const { providerId } = useParams();

  // History for redirect.
  let history = useHistory();

  // SWR state from the API for the provider.
  const { provider, providerLoading, providerError, mutateProvider } =
    useProvider(providerId, false);

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

    // react-hooks-form likes to send its data as a string,
    // so use the reportsChecked state to ensure it's a bool.
    data.receiveReports = reportsChecked;

    // Check whether values have actually changed before making API request.
    if (
      equal(data, {
        firstName: provider.firstName,
        lastName: provider.lastName,
        email: provider.email,
        phone: provider.phone,
        receiveReports: provider.receiveReports,
      })
    ) {
      setDisableButtons(false);
      setUnchangedWarning(true);
      return;
    }

    mutateProvider({ ...data }, false);

    await axios
      .put(`/api/providers/${provider.providerId}`, { ...data })
      .then((response) => {
        mutateProvider({ ...response.data }, false);
        history.push({
          pathname: `/settings/providers/${provider.providerId}`,
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
  if (providerLoading) return <Loading />;

  // Display error message if data fails to load (will retry 10 times).
  if (providerError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching data.
      </p>
    );

  if (provider.receiveReports === true && reportsChecked === null)
    setReportsChecked(true);
  else if (provider.receiveReports === false && reportsChecked === null)
    setReportsChecked(false);

  // #endregion

  // #region Render

  return (
    <>
      <Helmet>
        <title>
          Editing {provider.firstName} {provider.lastName} | BuildQuote
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
        <LinkContainer exact to={`/settings/providers/${providerId}`}>
          <Breadcrumb.Item>{provider.fullName}</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Edit</Breadcrumb.Item>
      </Breadcrumb>

      {submissionError ? (
        <Alert
          variant="danger"
          onClose={() => setSubmissionError(false)}
          dismissible
        >
          Error updating provider. Please try again.
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
          Editing {provider.firstName} {provider.lastName}
        </h1>
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="firstName" className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Jean"
              defaultValue={provider.firstName}
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
              defaultValue={provider.lastName}
              isInvalid={!!errors.lastName}
              {...register("lastName", { required: true })}
            />
            <p className="text-danger">{errors.lastName?.message}</p>
          </Form.Group>
          <Form.Group controlId="email" className="mb-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="email"
              placeholder="jeansmith@example.com"
              defaultValue={provider.email}
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
              defaultValue={provider.phone}
              isInvalid={!!errors.phone}
              {...register("phone", { required: true })}
            />
            <p className="text-danger">{errors.phone?.message}</p>
          </Form.Group>
          <Form.Group
            controlId="receiveReports"
            className="mb-2"
            onChange={() => setReportsChecked(!reportsChecked)}
          >
            <Form.Check
              defaultChecked={reportsChecked}
              value={true}
              label={"Receive weekly reports"}
              isInvalid={!!errors.receiveReports}
              {...register("receiveReports")}
            />
            <p className="text-danger">{errors.receiveReports?.message}</p>
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
          <LinkContainer
            exact
            to={`/settings/providers/${provider.providerId}`}
          >
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

export default EditProvider;
