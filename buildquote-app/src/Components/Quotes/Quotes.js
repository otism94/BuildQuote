// #region Imports

// Library imports
import React, { useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Container,
  Form,
  Table,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";

// Component imports
import Loading from "../../SubComponents/Loading";

// API imports
import useQuotes from "../../API/useQuotes";

// #endregion

// #region Quotes

const Quotes = (props) => {
  const [query, setQuery] = useState("");
  const [deleteSuccessful, setDeleteSuccessful] = useState(null);

  if (
    deleteSuccessful === null &&
    props.history.location.state?.deleteSuccessful != null
  )
    setDeleteSuccessful(true);

  return (
    <>
      <Helmet>
        <title>Quotes | BuildQuote</title>
      </Helmet>

      <Breadcrumb
        className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}
      >
        <LinkContainer exact to="/">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Quotes</Breadcrumb.Item>
      </Breadcrumb>

      {deleteSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setDeleteSuccessful(false)}
          dismissible
        >
          <strong>{props.history.location.state.deletedQuote}</strong> has been
          deleted.
        </Alert>
      ) : null}

      <Container>
        <h1 className="my-3">Quotes</h1>
        <Container className="mt-2 mb-4 d-flex justify-content-between flex-wrap">
          <Container className="w-75 px-0 mx-0 mb-3">
            <Form.Control
              type="text"
              placeholder="Search (e.g. '#1001' or 'Jean Smith')"
              onChange={(e) => setQuery(e.target.value)}
            ></Form.Control>
          </Container>

          <LinkContainer exact to="/quotes/new">
            <Button variant="outline-success" className="mb-3">
              <i className="fas fa-plus-circle"></i> New Quote
            </Button>
          </LinkContainer>
        </Container>
        <QuotesTable query={query} />
      </Container>
    </>
  );
};

// #endregion

// #region Child Components

const Quote = ({ quote }) => (
  <LinkContainer exact to={`/quotes/${quote.quoteId}`} className={"pointer"}>
    <tr>
      <td>#{quote.quoteNumber}</td>
      <td>
        {new Intl.DateTimeFormat("en-GB").format(new Date(quote.timeCreated))}
      </td>
      <td>&pound;{quote.grandTotal.toFixed(2)}</td>
      <td>
        {quote.customerId !== null ? quote.customer.fullName : <em>None</em>}
      </td>
      <td>
        {quote.providerId !== null ? quote.provider.fullName : <em>None</em>}
      </td>
      <td>
        {quote.timeEmailed !== null ? (
          <i className="fas fa-check text-success"></i>
        ) : (
          <i className="fas fa-times text-danger"></i>
        )}
      </td>
    </tr>
  </LinkContainer>
);

const QuotesTable = ({ query }) => {
  const { quotes, quotesLoading, quotesError } = useQuotes(false);

  if (quotesLoading) return <Loading />;

  if (quotesError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching quotes.
      </p>
    );

  const quotesList =
    query === ""
      ? quotes
          .map((quote) => <Quote key={quote.quoteNumber} quote={quote} />)
          .sort((a, b) => b.key - a.key)
      : quotes
          .filter(
            (quote) =>
              `#${quote.quoteNumber}`.includes(query.toLowerCase()) ||
              new Intl.DateTimeFormat("en-GB")
                .format(new Date(quote.timeCreated))
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
                .format(new Date(quote.timeCreated))
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              quote.grandTotal.toFixed(2).includes(query.toLowerCase()) ||
              quote.customer?.fullName
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              quote.customer?.firstName
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              quote.provider?.lastName
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              quote.provider?.fullName
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              quote.provider?.firstName
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              quote.provider?.lastName
                .toLowerCase()
                .includes(query.toLowerCase())
          )
          .map((quote) => <Quote key={quote.quoteId} quote={quote} />)
          .sort((a, b) => b.key - a.key);

  if (quotesList === null) return null;

  return (
    <>
      {quotesList.length > 0 ? (
        <Table responsive="md" striped hover>
          <thead>
            <tr>
              <th>Quote</th>
              <th>Date Created</th>
              <th>Total Price</th>
              <th>Customer</th>
              <th>Provider</th>
              <th>Emailed?</th>
            </tr>
          </thead>
          <tbody>{quotesList}</tbody>
        </Table>
      ) : (
        <p>
          <em>No quotes found.</em>
        </p>
      )}
    </>
  );
};

// #endregion

export default Quotes;
