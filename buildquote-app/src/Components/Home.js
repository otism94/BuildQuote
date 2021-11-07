import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Home = () => (
  <>
    <Row xs={1} md={2} className="g-4 mt-1 mb-4">
      <Col>
        <Card bg="light">
          <Card.Body>
            <Card.Title className="display-6 text-center mb-4">
              <i className="fas fa-file-invoice-dollar"></i>
              <br />
              Quotes
            </Card.Title>
            <ListGroup>
              <LinkContainer exact to="/quotes/new">
                <ListGroup.Item action className="list-group-item-light">
                  Make a new quote &rarr;
                </ListGroup.Item>
              </LinkContainer>
              <LinkContainer exact to="/quotes">
                <ListGroup.Item action className="list-group-item-light">
                  View past quotes &rarr;
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
              <i className="fas fa-shopping-basket"></i>
              <br />
              Products
            </Card.Title>
            <ListGroup>
              <LinkContainer exact to="/products/new">
                <ListGroup.Item action className="list-group-item-light">
                  Add a new product &rarr;
                </ListGroup.Item>
              </LinkContainer>
              <LinkContainer exact to="/products">
                <ListGroup.Item action className="list-group-item-light">
                  View all products &rarr;
                </ListGroup.Item>
              </LinkContainer>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row xs={1} md={2} className="g-4 mb-4">
      <Col>
        <Card bg="light">
          <Card.Body>
            <Card.Title className="display-6 text-center mb-4">
              <i className="fas fa-users"></i>
              <br />
              Customers
            </Card.Title>
            <ListGroup>
              <LinkContainer exact to="/customers/new">
                <ListGroup.Item action className="list-group-item-light">
                  Add a new customer &rarr;
                </ListGroup.Item>
              </LinkContainer>
              <LinkContainer exact to="/customers">
                <ListGroup.Item action className="list-group-item-light">
                  View all customers &rarr;
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
              <i className="fas fa-cog"></i>
              <br />
              Settings
            </Card.Title>
            <ListGroup>
              <LinkContainer exact to="/settings/reports">
                <ListGroup.Item action className="list-group-item-light">
                  Cron reports &rarr;
                </ListGroup.Item>
              </LinkContainer>
              <LinkContainer exact to="/settings/providers">
                <ListGroup.Item action className="list-group-item-light">
                  Providers &rarr;
                </ListGroup.Item>
              </LinkContainer>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </>
);

export default Home;
