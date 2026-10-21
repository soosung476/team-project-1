import { Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./common/layout/AppLayout";
import Home from "./features/home/pages/Home";
import BoardDetail from "./features/board/pages/BoardDetail";
import BoardEdit from "./features/board/pages/BoardEdit";
import BoardList from "./features/board/pages/BoardList";
import BoardWrite from "./features/board/pages/BoardWrite";
import LoginPage from "./features/user/pages/LoginPage";
import SignupPage from "./features/user/pages/SignupPage";
import RoomReservation from "./features/room/pages/RoomReservation";
function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/notices"></Route>
          <Route path="/approvals"></Route>
          <Route path="/rooms" element={<RoomReservation />} />
          <Route path="/boards">
            <Route index element={<BoardList />} />
            <Route path="write" element={<BoardWrite />} />
            <Route path=":id" element={<BoardDetail />} />
            <Route path=":id/edit" element={<BoardEdit />} />
          </Route>
          <Route path="/users">
            <Route path="signin" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>
          <Route path="/admin/users"></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
