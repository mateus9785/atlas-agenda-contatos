import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import PrivateRoute from "config/privateRoute";
import UnconfirmedEmail from 'views/authentication/UnconfirmedEmail';
import AdminLayout from "layouts/Admin.jsx";
import Register from "views/authentication/Register";
import Login from "views/authentication/Login";
import ForgotPassword from "views/authentication/ForgotPassword";
import ResetPassword from "./views/authentication/ResetPassword";
import ConfirmedEmail from 'views/authentication/ConfirmedEmail';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={(props) => <Login {...props} />} />
        <Route
          path="/forgot-password"
          render={(props) => <ForgotPassword {...props} />}
        />
        <Route
          path="/reset-password/:token"
          component={(props) => <ResetPassword {...props} />}
        />
        <Route
          path="/unconfirmed-email"
          component={(props) => <UnconfirmedEmail {...props} />}
        />
        <PrivateRoute
          path="/admin"
          component={(props) => <AdminLayout {...props} />}
        />
        <Route
          path="/confirmed-email"
          component={(props) => <ConfirmedEmail {...props} />}
        />
        <Route
          path="/register"
          render={(props) => <Register {...props} />}
        />
        <Route exact path="*" render={(props) => <Login {...props} />} />
      </Switch>
    </BrowserRouter>
  );
}
