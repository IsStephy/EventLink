import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faChevronDown, faChevronUp, faCalendarDay, faClock, faTag, faSearch, faCalendar, faCircle,  faGripLinesVertical} from '@fortawesome/free-solid-svg-icons';

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

export const VerticalBar = () => {
  return (
    <FontAwesomeIcon icon={faGripLinesVertical}/>
  )
}

export const ClockIcon = () => {
  return (
    <FontAwesomeIcon icon={faClock} />
  )
}

export const PlaceIcon = () => {
  return (
    <FontAwesomeIcon icon={faMapMarkerAlt}/>
  )
}

export const OrganizerIcon = () => {
  return (
    <FontAwesomeIcon icon={faUser}/>
  )
}

export const StarIcon = ({ filled, onClick }) => {
  return (
    <svg
      onClick={onClick}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "#FFD700" : "none"}
      stroke={filled ? "#FFD700" : "#666666"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: 'pointer' }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};