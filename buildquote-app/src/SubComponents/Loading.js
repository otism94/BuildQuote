import { Container, Spinner } from "react-bootstrap";

const Loading = () => (
  <Container className={"d-flex justify-content-center align-items-center"}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Container>
);

export default Loading;
