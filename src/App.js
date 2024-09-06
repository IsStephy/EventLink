import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSearch, faCalendarCheck, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './fonts.css';


class Event {
  constructor(name, date, time, location) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.location = location;
  }
}

function UpcomingEvents({ events }) {
  const lastEvents = events.slice(-2); // Gets the last two events

  return (
    <div>
      {lastEvents.map((upcomingEvent, index) => (
        <div key={index} className='upcoming-event-css'>
          <h4>Name: {upcomingEvent.name}</h4>
          <p>
            Date: {upcomingEvent.date.toDateString()}
            <br />Location: {upcomingEvent.location}
          </p>
        </div>
      ))}
    </div>
  );
}

const SearchIcon = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faSearch} className="search-icon-css" />
    </div>
  );
};

const CalendarIcon = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon-css" />
    </div>
  );
};

function App() {
  const [events, setEvents] = useState([
    new Event('Lecture', new Date(2024, 8, 4), '10:00', 'Aula 3-3'),
    new Event(`Programmer's Day`, new Date(2024, 8, 14), '17:00', 'Tekwill')
  ]);

  const [calendarEvents, setCalendarEvents] = useState({});

  useEffect(() => {
    const eventsByDate = events.reduce((accumulation, event) => {
      const dateKey = event.date.toDateString();
      if (!accumulation[dateKey]) {
        accumulation[dateKey] = [];
      }
      accumulation[dateKey].push(event);
      return accumulation;
    }, {});

    setCalendarEvents(eventsByDate);
  }, [events]);

  const tileContent = ({ date, view }) => {
    const dateKey = date.toDateString();
    const eventsForDate = calendarEvents[dateKey];

    return view === 'month' && eventsForDate ? (
      <div>
        {eventsForDate.map((event, index) => (
          <div key={index} className="event-css">
            <strong>{event.name}</strong> <div>{event.time}, {event.location}</div>
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="gradient-background">
      <div className="calendar-and-upc-events-css">
        <div>
          <h1 className='upcoming-events-text-css'>Upcoming Events</h1>
          <UpcomingEvents events={events} />
        </div>
        <div className="search-calendar">
          <div className="search-icon-text-css">
            <div className="icon-calendar-text-css">
            <CalendarIcon />
            <div>Calendar</div>
            </div>
            <div><button> <SearchIcon /> </button></div>
          </div>
          <div>
            <Calendar tileContent={tileContent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
