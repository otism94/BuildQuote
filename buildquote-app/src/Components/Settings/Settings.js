import { Breadcrumb, Card, Col, ListGroup, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";

const Settings = () => (
  <>
    <Helmet>
      <title>Settings | BuildQuote</title>
    </Helmet>

    <Breadcrumb className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}>
      <LinkContainer exact to="/">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </LinkContainer>
      <Breadcrumb.Item active>Settings</Breadcrumb.Item>
    </Breadcrumb>

    <Row xs={1} md={2} className="g-4 mt-1 mb-4">
      <Col>
        <Card bg="light">
          <Card.Body>
            <Card.Title className="display-6 text-center mb-4">
              <i className="fas fa-file-invoice"></i>
              <br />
              Reports
            </Card.Title>
            <p>View and manage daily cron reports.</p>
            <ListGroup>
              <LinkContainer exact to="/settings/reports">
                <ListGroup.Item action className="list-group-item-light">
                  View sent reports &rarr;
                </ListGroup.Item>
              </LinkContainer>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card bg="light">
          <Card.Body>
            <Card.Title className="display-6 text-center mb-4">
              <i className="fas fa-briefcase"></i>
              <br />
              Providers
            </Card.Title>
            <ListGroup>
              <LinkContainer exact to="/products/new">
                <ListGroup.Item action className="list-group-item-light">
                  Add a new provider &rarr;
                </ListGroup.Item>
              </LinkContainer>
              <LinkContainer exact to="/products">
                <ListGroup.Item action className="list-group-item-light">
                  View all providers &rarr;
                </ListGroup.Item>
              </LinkContainer>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </>
);

export default Settings;
