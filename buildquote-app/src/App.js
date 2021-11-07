import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

// Global components
import Header from "./SubComponents/Header";
import Footer from "./SubComponents/Footer";

// Home
import Home from "./Components/Home";

// Quotes
import Quotes from "./Components/Quotes/Quotes";
import QuotePage from "./Components/Quotes/QuotePage";
import EditQuote from "./Components/Quotes/EditQuote";
import NewQuote from "./Components/Quotes/NewQuote";

// Products
import Products from "./Components/Products/Products";
import ProductPage from "./Components/Products/ProductPage";
import EditProduct from "./Components/Products/EditProduct";
import NewProduct from "./Components/Products/NewProduct";

// Customers
import Customers from "./Components/Customers/Customers";
import CustomerPage from "./Components/Customers/CustomerPage";
import EditCustomer from "./Components/Customers/EditCustomer";
import NewCustomer from "./Components/Customers/NewCustomer";

// Settings
import Settings from "./Components/Settings/Settings";

// Reports
import Reports from "./Components/Settings/Reports/Reports";
import ReportPage from "./Components/Settings/Reports/ReportPage";

// Providers
import Providers from "./Components/Settings/Providers/Providers";
import ProviderPage from "./Components/Settings/Providers/ProviderPage";
import EditProvider from "./Components/Settings/Providers/EditProvider";
import NewProvider from "./Components/Settings/Providers/NewProvider";

// 404
import NotFound from "./Components/NotFound";

const App = () => (
  <BrowserRouter>
    <Container>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />

        <Route exact path="/quotes" component={Quotes} />
        <Route exact path="/quotes/new" component={NewQuote} />
        <Route exact path="/quotes/:quoteId" component={QuotePage} />
        <Route exact path="/quotes/:quoteId/edit" component={EditQuote} />

        <Route exact path="/products" component={Products} />
        <Route exact path="/products/new" component={NewProduct} />
        <Route exact path="/products/:productId" component={ProductPage} />
        <Route exact path="/products/:productId/edit" component={EditProduct} />

        <Route exact path="/customers" component={Customers} />
        <Route exact path="/customers/new" component={NewCustomer} />
        <Route exact path="/customers/:customerId" component={CustomerPage} />
        <Route
          exact
          path="/customers/:customerId/edit"
          component={EditCustomer}
        />

        <Route exact path="/settings" component={Settings} />
        <Route exact path="/settings/reports" component={Reports} />
        <Route
          exact
          path="/settings/reports/:reportId"
          component={ReportPage}
        />
        <Route exact path="/settings/providers" component={Providers} />
        <Route exact path="/settings/providers/new" component={NewProvider} />
        <Route
          exact
          path="/settings/providers/:providerId"
          component={ProviderPage}
        />
        <Route
          exact
          path="/settings/providers/:providerId/edit"
          component={EditProvider}
        />

        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Container>
  </BrowserRouter>
);

export default App;
