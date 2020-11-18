import Contacts from "views/admin/Contacts/index.jsx";
import Contact from "views/admin/Contacts/Contact/index.jsx";
import Groups from "views/admin/Groups/index.jsx";
import UserProfile from "views/admin/UserProfile";
import ImportContact from "views/admin/ImportContact";

var routes = [
  {
    path: "/user-profile",
    invisible: true,
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/contacts",
    name: "Contatos",
    icon: "fas fa-user",
    component: Contacts,
    layout: "/admin",
  },
  {
    path: "/contact",
    invisible: true,
    component: Contact,
    layout: "/admin",
  },
  {
    path: "/groups",
    name: "Grupos",
    icon: "fas fa-users",
    component: Groups,
    layout: "/admin",
  },
  {
    path: "/import-contact",
    name: "Importar",
    icon: "fas fa-file-import",
    component: ImportContact,
    layout: "/admin",
  },
];
export default routes;
