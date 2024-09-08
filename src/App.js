import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// Class representing a Place
class Place {
  constructor(id, raion, oras, strada) {
    this.id = id;
    this.raion = raion;
    this.oras = oras;
    this.strada = strada;
  }
}

// Class representing an Organizer
class Organizer {
  constructor(id, start_date, nume, domeniu) {
    this.id = id;
    this.start_date = start_date;
    this.nume = nume;
    this.domeniu = domeniu;
  }
}

// Class representing an Event
class Event {
  constructor(id, titlu, descriere, data, tip, organizer, place) {
    this.id = id;
    this.titlu = titlu;
    this.descriere = descriere;
    this.data = data;
    this.tip = tip;
    this.organizer = organizer;
    this.place = place;
  }
}

// Component to display upcoming events
function UpcomingEvents({ events }) {
  const lastEvents = events.slice(-2); // Gets the last two events

  return (
    <div>
      {lastEvents.map((upcomingEvent, index) => (
        <div key={index} className='upcoming-event-css'>
          <h4>Title: {upcomingEvent.titlu}</h4>
          <p className='upcoming-event-paragraph-css'>
            Description: {upcomingEvent.descriere}<br />
            Date: {upcomingEvent.data.toDateString()}<br />
            Type: {upcomingEvent.tip}<br />
            Organizer: {upcomingEvent.organizer.nume}<br />
            Place: {upcomingEvent.place.oras}, {upcomingEvent.place.strada}
          </p>
        </div>
      ))}
    </div>
  );
}

// Component to display filtered events
function FilteredEvents({ events }) {
  return (
    <div>
      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={index} className='filtered-event-css'>
            <h4>Title: {event.titlu}</h4>
            <p className='filtered-event-paragraph-css'>
              Description: {event.descriere}<br />
              Date: {event.data.toDateString()}<br />
              Type: {event.tip}<br />
              Organizer: {event.organizer.nume}<br />
              Place: {event.place.oras}, {event.place.strada}
            </p>
          </div>
        ))
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
}

// FontAwesome Icons
const SearchIcon = () => (
  <div>
    <FontAwesomeIcon icon={faSearch} className="search-icon-css" />
  </div>
);

const CalendarIcon = ({ onClick }) => (
  <button className='button-calendar-icon-css' onClick={onClick}>
    <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon-css" />
  </button>
);

// Main App Component
function App() {
  const [inputValue, setInputValue] = useState('');
  const [events, setEvents] = useState([
    new Event(
      1,
      'Lecture',
      'A lecture on modern web development.',
      new Date(2024, 8, 4),
      'Obligatoriu',
      new Organizer(1, new Date(2024, 8, 1), 'Tech University', 'Education'),
      new Place(1, 'Central', 'City A', 'Main Street 123')
    ),
    new Event(
      2,
      "Programmer's Day",
      'An event to celebrate programmers.',
      new Date(2024, 8, 14),
      'Opționaln',
      new Organizer(2, new Date(2024, 8, 20), 'Tech Corp', 'Technology'),
      new Place(2, 'West', 'City B', 'Tech Park 456')
    )
  ]);

  const [calendarEvents, setCalendarEvents] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true); 
  const [showUpcomingEvents, setUpcomingEvents] = useState(true);
  const [showEventFromCalendar, setEventFromCalendar] = useState(null);

  useEffect(() => {
    const eventsByDate = events.reduce((accumulation, event) => {
      const dateKey = event.data.toDateString();
      if (!accumulation[dateKey]) {
        accumulation[dateKey] = [];
      }
      accumulation[dateKey].push(event);
      return accumulation;
    }, {});

    setCalendarEvents(eventsByDate);
  }, [events]);

  // Function to handle the search click
  const handleSearchClick = () => {
    const searchQuery = inputValue.toLowerCase();
    const filtered = events.filter(event =>
      event.titlu.toLowerCase().includes(searchQuery) ||
      event.descriere.toLowerCase().includes(searchQuery) ||
      event.organizer.nume.toLowerCase().includes(searchQuery)
    );
    setFilteredEvents(filtered); // Update filtered events
    setSearchPerformed(true); // Indicate that search has been performed
    setShowCalendar(false); // Hide calendar after search
  };

  const handleEventCalendarClick = (event) => {
    setUpcomingEvents(false);
    setEventFromCalendar(event);
  }

  // Function to render event details on the calendar
  const tileContent = ({ date, view }) => {
    const dateKey = date.toDateString();
    const eventsForDate = calendarEvents[dateKey];

    return view === 'month' && eventsForDate ? (
      <div>
        {eventsForDate.map((event, index) => (
          <div key={index} className='event-on-calendar-button-css' onClick={() => handleEventCalendarClick(event)}>
          <div className="event-css">
            <strong>{event.titlu}</strong>
            <div>{event.data.toLocaleTimeString()}, {event.place.oras}</div>
          </div>
        </div>
        
        ))}
      </div>
    ) : null;
  };

  // Function to handle the calendar button click
  const handleCalendarClick = () => {
    setShowCalendar(true); // Show the calendar
    setSearchPerformed(false); // Reset search state
  };

  return (
    <div className='purple-container-css'>
      <div className="gradient-background">
        <div className="calendar-and-upc-events-css">
          <div className="upcoming-events-or-events-from-calendar">
            {showUpcomingEvents ? (
              <div className="upcoming-events-section">
                <h2 className='upcoming-events-text-css'>Upcoming Events</h2>
                <UpcomingEvents events={events} />
              </div>
            ) : showEventFromCalendar ? (
              <div className='event-from-calendar'>
                <FilteredEvents events={[showEventFromCalendar]} />
              </div>
            ) : null}
          </div>

          <div className="calendar-section">
            <div className="search-icon-text-css">
              <div className="icon-calendar-text-css">
                <CalendarIcon onClick={handleCalendarClick} />
                <div className='calendar-text-css'>Calendar</div>
              </div>
              <div className='search-bar-css'>
                <input 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  className='input-search-css' 
                  placeholder="Search for event"
                />
                <button className='button-search-icon-css' onClick={handleSearchClick}>
                  <SearchIcon />
                </button>
              </div>
            </div>
            <hr className='line-css' />
            <div className='calendar-or-events'>
              {searchPerformed ? (
                <FilteredEvents events={filteredEvents} />
              ) : showCalendar ? (
                <div className='calendar-css'><Calendar tileContent={tileContent} /></div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
