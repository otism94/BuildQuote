import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

const Header = () => (
  <Navbar bg="dark" variant="dark" expand="md" className="sticky-top">
    <Container>
      <LinkContainer exact to="/">
        <Navbar.Brand>
          <i className="fas fa-hammer"></i> BuildQuote
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer exact to="/quotes">
            <Nav.Item as={"a"} bsPrefix={"nav-link"}>
              Quotes
            </Nav.Item>
          </LinkContainer>
          <LinkContainer exact to="/products">
            <Nav.Item as={"a"} bsPrefix={"nav-link"}>
              Products
            </Nav.Item>
          </LinkContainer>
          <LinkContainer exact to="/customers">
            <Nav.Item as={"a"} bsPrefix={"nav-link"}>
              Customers
            </Nav.Item>
          </LinkContainer>
          <NavDropdown title="Settings" id="navbar-settings-dropdown">
            <NavDropdown.Item>
              <Link
                exact
                to="/settings/reports"
                bsPrefix={"nav-link"}
                className="text-dark"
              >
                Reports
              </Link>
            </NavDropdown.Item>

            <NavDropdown.Item>
              <Link
                exact
                to="/settings/providers"
                bsPrefix={"nav-link"}
                className="text-dark"
              >
                Providers
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      <LinkContainer to="/quotes/new">
        <Button>New Quote</Button>
      </LinkContainer>
    </Container>
  </Navbar>
);

export default Header;
