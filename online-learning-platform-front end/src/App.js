import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🔹 Auth Components
import SignUpComponent from './components/signup/SignUpComponent';
import SignInComponent from './components/signin/SignInComponent';

// 🔹 Dashboards
import AdminDashboard from './components/admin/admin dashboard/AdminDashboard';
import StudentDashboard from './components/student/dashboard/StudentDashboard';

// 🔹 Courses
import CourseList from './components/student/course-list/CourseList';
import InstructorCourseList from './components/intructor/course-list/InstructorCourseList'
import CourseDetails from './components/student/course-details/CourseDetails';

// 🔹 Payment Modals
import PaymentSuccess from './components/modals/payment-modals/payment-success/PaymentSuccess'
import PaymentFailed from './components/modals/payment-modals/payment-failed/PaymentFailed'
import PaymentCancel from './components/modals/payment-modals/payment-cancel/PaymentCancel'
import EnrolledCourseList from './components/student/enrolled-courses/EnrolledCourseList';
import EnrolledCourse from './components/student/enrolled-course-details/EnrolledCourse';
import Lessons from './components/student/lessons/Lessons';
import AssignmentList from './components/student/assignments/AssignmentList';
import InstructorDashboard from './components/intructor/dashboard/IntructorDashboard';
import AddCourse from './components/intructor/add-course/AddCourse';
import IntructorCourseDetails from './components/intructor/course-details/IntructorCourseDetails';
import EditCourse from './components/intructor/edit-course/EditCourse';
import AddAssignment from './components/intructor/add-assignment/AddAssignment';
import CourseAssignment from './components/intructor/assignments/CourseAssignment';
import CourseAssignmentList from './components/intructor/assignment-list/CourseAssignmentList';
import SubmissionList from './components/intructor/submission-list/SubmissionList';
import AdminCourseList from './components/admin/course-list/AdminCourseList';
import InstructorList from './components/admin/instructor-list/InstructorList';
import StudentList from './components/admin/student-list/StudentList';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          {/* Auth Routes */}
          <Route path="/" element={<SignInComponent />} />
          <Route path="/sign-in" element={<SignInComponent />} />
          <Route path="/sign-up" element={<SignUpComponent />} />

          {/* Dashboard Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          {/* Course Routes */}
          <Route path="/courses-list" element={<CourseList />} />
          <Route path="/course-details/:id" element={<CourseDetails />} />
           <Route path="/enrolled-courses" element={<EnrolledCourseList/>} />
           <Route path="/enrolled-course/:id" element={<EnrolledCourse/>} />
          <Route path="/lessons/:courseId/:moduleId" element={<Lessons />} />
          <Route path="/assignment-list" element={<AssignmentList/>} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard/>} />
           <Route path="/instructor-courses-list" element={<InstructorCourseList/>} />
           <Route path="/add-course" element={<AddCourse/>} />
           <Route path="/instructor-course-details/:id" element={<IntructorCourseDetails/>} />
           <Route path="/edit-course/:id" element={<EditCourse/>} />
           <Route path="/add-assignment/:id" element={<AddAssignment/>} />
           <Route path="/course-assignments" element={<CourseAssignment/>} />
           <Route path="/course-assignment-list/:id" element={<CourseAssignmentList/>} />
           <Route path="/assignment-submission-list/:id" element={<SubmissionList/>} />
           <Route path="/admin-course-list" element={<AdminCourseList/>} />
           <Route path="/instructor-list" element={<InstructorList/>} />
           <Route path="/student-list" element={<StudentList/>} />


          {/* Payment Result Routes */}
          <Route
            path="/payment-success"
            element={<PaymentSuccess onClose={() => window.location.href = '/student-dashboard'} />}
          />
          <Route
            path="/payment-cancel"
            element={<PaymentCancel onClose={() => window.location.href = '/courses-list'} />}
          />
          <Route
            path="/payment-failed"
            element={<PaymentFailed onClose={() => window.location.href = '/courses-list'} />}
          />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
