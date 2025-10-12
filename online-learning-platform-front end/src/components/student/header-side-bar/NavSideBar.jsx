import React from 'react';
import './NavSideBar.css';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Home', path: '/student-dashboard' },
  { label: 'Courses', path: '/courses-list' },
  { label: 'Enrollment', path: '/enrolled-courses' },
  { label: 'Assessments', path: '/assignment-list' },
];

const NavSideBar = () => {
  const location = useLocation();
  return (
    <aside className="nav-sidebar">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default NavSideBar;