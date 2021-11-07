// #region Imports

// Library imports
import React, { useState } from "react";
import { Alert, Breadcrumb, Container, Form, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// Component imports
import Loading from "../../../SubComponents/Loading";

// API imports
import useReports from "../../../API/useReports";

// #endregion

// #region Reports

const Reports = (props) => {
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
        <title>Reports | BuildQuote</title>
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
        <Breadcrumb.Item active>Reports</Breadcrumb.Item>
      </Breadcrumb>

      {deleteSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setDeleteSuccessful(false)}
          dismissible
        >
          <strong>
            Report for {props.history.location.state.deletedReport}
          </strong>{" "}
          has been deleted.
        </Alert>
      ) : null}

      <Container>
        <h1 className="my-3">Reports</h1>
        <Container className="mt-2 mb-4 d-flex justify-content-between flex-wrap">
          <Container>
            <p>
              A report of all the quotes emailed to customers that day will be
              emailed to providers daily at 5pm UK time.
            </p>
            <p>
              You can configure whether or not a provider will receive these
              reports on their{" "}
              <Link exact to="/settings/providers">
                details page.
              </Link>{" "}
            </p>
          </Container>
          <Container className="w-75 px-0 mx-0 mb-3">
            <Form.Control
              type="text"
              placeholder="Search (e.g. 'November' or '01/11/2021')"
              onChange={(e) => setQuery(e.target.value)}
            ></Form.Control>
          </Container>
        </Container>
        <ReportsTable query={query} />
      </Container>
    </>
  );
};

// #endregion

// #region Child Components

const Report = ({ report }) => (
  <LinkContainer
    exact
    to={`/settings/reports/${report.reportId}`}
    className={"pointer"}
  >
    <tr>
      <td>
        {new Intl.DateTimeFormat("en-GB").format(new Date(report.reportDate))}
      </td>
      <td>{report.quotesCount}</td>
      <td>&pound;{report.netTotal.toFixed(2)}</td>
      <td>&pound;{report.totalVat.toFixed(2)}</td>
      <td>&pound;{report.grandTotal.toFixed(2)}</td>
    </tr>
  </LinkContainer>
);

const ReportsTable = ({ query }) => {
  const { reports, reportsLoading, reportsError } = useReports();

  if (reportsLoading) return <Loading />;

  if (reportsError)
    return (
      <p className="text-danger">
        <i className="fas fa-exclamation-circle"></i> Error fetching reports.
      </p>
    );

  const reportsList =
    query === ""
      ? reports
          .map((report) => <Report key={report.reportDate} report={report} />)
          .sort((a, b) => new Date(b.key) - new Date(a.key))
      : reports
          .filter(
            (report) =>
              new Intl.DateTimeFormat("en-GB")
                .format(new Date(report.reportDate))
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
                .format(new Date(report.reportDate))
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              report.grandTotal.toFixed(2).includes(query.toLowerCase())
          )
          .map((report) => <Report key={report.reportId} report={report} />)
          .sort((a, b) => new Date(b.key) - new Date(a.key));

  if (reportsList === null) return null;

  return (
    <>
      {reportsList.length > 0 ? (
        <Table responsive="md" striped hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Quotes Count</th>
              <th>Net Total</th>
              <th>VAT Total</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>{reportsList}</tbody>
        </Table>
      ) : (
        <p>
          <em>No reports found.</em>
        </p>
      )}
    </>
  );
};

// #endregion

export default Reports;
