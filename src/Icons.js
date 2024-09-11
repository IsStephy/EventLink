import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faChevronDown, faChevronUp, faCalendarDay, faClock, faTag, faSearch, faCalendar, faCircle } from '@fortawesome/free-solid-svg-icons';

export const SearchIcon = () => (
  <div>
    <FontAwesomeIcon icon={faSearch} className="search-icon-css" />
  </div>
);

export const CalendarIcon = ({ onClick }) => (
  <button className='button-calendar-icon-css' onClick={onClick}>
    <FontAwesomeIcon icon={faCalendar} className="calendar-icon-css" />
  </button>
);

export const PointIcon = () => (
  <div>
    <FontAwesomeIcon icon={faCircle} className='point-icon-css' />
  </div>
);

export const ShowMoreIcon = () => (
  <div>
    <FontAwesomeIcon icon={faChevronDown} className='show-more-icon-css' />
  </div>
);

export const DateIcon = () => (
  <div>
    <FontAwesomeIcon icon={faCalendarDay} className='date-icon-css' />
  </div>
);

export const ShowLessButton = () => {
  return (
    <FontAwesomeIcon icon={faChevronUp} className='show-less-icon-css' />
  );
};
