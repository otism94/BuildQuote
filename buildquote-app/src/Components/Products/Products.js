// #region Imports

// Library imports
import React, { useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Table,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// Component imports
import Loading from "../../SubComponents/Loading";

// API imports
import useCategories from "../../API/useCategories";
import useCategory from "../../API/useCategory";

// #endregion

// #region Products

const Products = (props) => {
  const [categoryId, setCategoryId] = useState("");

  const [deleteSuccessful, setDeleteSuccessful] = useState(null);

  if (categoryId === "" && props.history.location.state?.presetCategory != null)
    setCategoryId(props.history.location.state.presetCategory);

  if (
    deleteSuccessful === null &&
    props.history.location.state?.deleteSuccessful != null
  )
    setDeleteSuccessful(true);

  return (
    <>
      <Helmet>
        <title>Products | BuildQuote</title>
      </Helmet>

      <Breadcrumb
        className={"pt-3 px-3 mb-3 bg-light d-flex align-items-center"}
      >
        <LinkContainer exact to="/">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>Products</Breadcrumb.Item>
      </Breadcrumb>

      {deleteSuccessful ? (
        <Alert
          variant="success"
          onClose={() => setDeleteSuccessful(false)}
          dismissible
        >
          <strong>{props.history.location.state.deletedProduct}</strong> has
          been deleted.
        </Alert>
      ) : null}

      <Container>
        <h1 className="my-3">Products</h1>
        <Container className="mt-2 mb-4 d-flex justify-content-between">
          <CategoriesDropdown setCategoryId={setCategoryId} />
          <LinkContainer exact to="/products/new">
            <Button variant="outline-success">
              <i className="fas fa-plus-circle"></i> New Product
            </Button>
          </LinkContainer>
        </Container>
        {!categoryId ? (
          <p className="d-flex justify-content-center">
            <em>Products will show up here.</em>
          </p>
        ) : (
          <Container>
            <ProductsTable categoryId={categoryId} />
          </Container>
        )}
      </Container>
    </>
  );
};

// #endregion

// #region Child Components

const CategoriesDropdown = ({ setCategoryId }) => {
  const { categories, categoriesLoading } = useCategories(true);

  if (categoriesLoading)
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" disabled>
          <Loading />
        </Dropdown.Toggle>
      </Dropdown>
    );

  return (
    <DropdownButton
      title="Select a Category"
      variant="secondary"
      onSelect={(eventKey) => setCategoryId(eventKey)}
    >
      {categories.map((category) => (
        <Dropdown.Item key={category.categoryId} eventKey={category.categoryId}>
          {category.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

const Product = ({ product }) => (
  <LinkContainer
    exact
    to={`/products/${product.productId}`}
    className={"pointer"}
  >
    <tr>
      <td>{product.name}</td>
      <td>&pound;{product.unitPrice.toFixed(2)}</td>
      <td>{product.vatRate}%</td>
      <td>&pound;{product.overallPrice.toFixed(2)}</td>
    </tr>
  </LinkContainer>
);

const ProductsTable = ({ categoryId }) => {
  const { category, categoryLoading } = useCategory(categoryId, true);

  if (categoryLoading) return <Loading />;

  const productsList =
    category != null
      ? category.products
          .map((product) => (
            <Product
              key={`${product.name}-${product.productId}`}
              product={product}
            />
          ))
          .sort((a, b) => b.key - a.key)
      : null;

  if (productsList === null) return null;

  return (
    <>
      <h3>{category.name}</h3>
      {productsList.length > 0 ? (
        <Table responsive="md" striped hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>VAT Rate</th>
              <th>Overall Price</th>
            </tr>
          </thead>
          <tbody>{productsList}</tbody>
        </Table>
      ) : (
        <p>
          <em>
            No products found for {category.name}.{" "}
            <Link
              to={{
                pathname: "/products/new",
                state: { presetCategory: category.categoryId },
              }}
            >
              Add one?
            </Link>
          </em>
        </p>
      )}
    </>
  );
};

// #endregion

export default Products;
