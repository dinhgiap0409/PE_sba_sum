import "./App.css";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import EmployeeList from "./pages/EmployeeList";
import ViewDetails from "./pages/ViewDetails";
import AddNew from "./pages/AddNew";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout></AppLayout>}>
          <Route path="/" element={<EmployeeList></EmployeeList>}></Route>
          <Route
            path="/ViewDetails/:id"
            element={<ViewDetails></ViewDetails>}
          ></Route>
          <Route path="/AddNew" element={<AddNew></AddNew>}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
