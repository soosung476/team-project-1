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
import AdminUserPage from "./features/admin/pages/AdminUserPage";
import NoticeList from "./features/notice/pages/NoticeList";
import ApprovalList from "./features/approval/pages/ApprovalList";
import ApprovalInbox from "./features/approval/pages/ApprovalInbox";
import ApprovalWrite from "./features/approval/pages/ApprovalWrite";
import ApprovalDetail from "./features/approval/pages/ApprovalDetail";
import NoticeDetail from "./features/notice/pages/NoticeDetail";
import NoticeWrite from "./features/notice/pages/NoticeWrite";
import NoticeEdit from "./features/notice/pages/NoticeEdit";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/approvals">
            <Route index element={<ApprovalList />} />
            <Route path="inbox" element={<ApprovalInbox />} />
            <Route path="write" element={<ApprovalWrite />} />
            <Route path=":id" element={<ApprovalDetail />} />
          </Route>
          <Route path="/notices">
            <Route index element={<NoticeList />} />
            <Route path=":id" element={<NoticeDetail />} />
            <Route path=":id/edit" element={<NoticeEdit />} />
            <Route path="write" element={<NoticeWrite />} />
          </Route>
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
          <Route path="/admin/users" element={<AdminUserPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
