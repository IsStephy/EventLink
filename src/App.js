import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { HalfUpcomingEvents, FilteredEvents } from './EventsDisplay';
import { SearchIcon, CalendarIcon } from './Icons';
import './App.css';
import { Event, Organizer, Place } from './EventModels';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [events, setEvents] = useState([
    new Event(
      1,
      'Lecture',
      'A lecture on modern web development.',
      new Date(2024, 8, 4),
      'Obligatoriu',
      '10:00 - 11:30',
      new Organizer(1, new Date(2024, 8, 1), 'Tech University', 'Education'),
      new Place(1, 'Central', 'City A', 'Main Street 123')
    ),
    new Event(
      2,
      "Programmer's Day",
      'An event to celebrate programmers.',
      new Date(2024, 8, 14),
      'Opțional',
      "16:00 - 18:00",
      new Organizer(2, new Date(2024, 8, 20), 'Tech Corp', 'Technology'),
      new Place(2, 'West', 'City B', 'Tech Park 456')
    )
  ]);

  const [calendarEvents, setCalendarEvents] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);

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

  const handleSearchClick = () => {
    const searchQuery = inputValue.toLowerCase();
    const filtered = events.filter(event =>
      event.titlu.toLowerCase().includes(searchQuery) ||
      event.descriere.toLowerCase().includes(searchQuery) ||
      event.organizer.nume.toLowerCase().includes(searchQuery)
    );
    setFilteredEvents(filtered);
    setSearchPerformed(true);
    setSelectedEvent(null);
    setInputValue('');
  };

  const handleEventCalendarClick = (event) => {
    setSelectedEvent(event);
    setSearchPerformed(false);
  };

  const tileContent = ({ date, view }) => {
    const dateKey = date.toDateString();
    const eventsForDate = calendarEvents[dateKey];
    const currentDate = new Date();
    const isCurrentMonth = date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();

    return view === 'month' && eventsForDate ? (
      <div className={`event-on-calendar-button-css ${!isCurrentMonth ? 'faded-date' : ''}`}>
        {eventsForDate.map((event, index) => (
          <div key={index} onClick={() => handleEventCalendarClick(event)}>
            <div className={`event-css ${event.tip === 'Obligatoriu' ? 'mandatory-event' : 'optional-event'}`}>
              <p>{event.titlu}</p>
              <p>{event.ora}</p>
            </div>
          </div>
        ))}
      </div>
    ) : null;
  };

  const handleCalendarClick = () => {
    setSearchPerformed(false);
    setSelectedEvent(null);
  };

  const handleBackClick = () => {
    setSearchPerformed(false);
    setSelectedEvent(null);
  };

  const handleShowMore = (eventId) => {
    setExpandedEventId(eventId);
  };

  const handleHideMore = () => {
    setExpandedEventId(null);
  };

  return (
    <div className='purple-container-css'>
      <div className="gradient-background">
        <div className="calendar-and-upc-events-css">
          <div className="upcoming-events-or-events-from-calendar">
            {!searchPerformed && !selectedEvent && (
              <div className="upcoming-events-section">
                <h2 className='upcoming-events-text-css'>Upcoming Events</h2>
                <HalfUpcomingEvents events={events} expandedEventId={expandedEventId} onShowMore={handleShowMore} onHideMore={handleHideMore} />
              </div>
            )}

            {searchPerformed && filteredEvents.length > 0 && (
              filteredEvents.map((event, index) => (
                <FilteredEvents 
                  key={index}
                  event={event} 
                  onBack={handleBackClick}
                />
              ))
            )}
            {filteredEvents.length === 0 && searchPerformed && (
              <p className='no-events-found-css'> No events found.</p>
            )}

            {selectedEvent && (
              <FilteredEvents 
                event={selectedEvent}
                onBack={handleBackClick}
              />
            )}
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
            <div className='calendar-css'>
              <Calendar tileContent={tileContent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
