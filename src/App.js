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
    ),
    new Event(
      3,
      'Conference',
      'Annual tech conference.',
      new Date(2024, 8, 14),
      'Obligatoriu',
      '09:00 - 17:00',
      new Organizer(4, new Date(2024, 8, 15), 'Tech World', 'Technology'),
      new Place(4, 'North', 'City D', 'Conference Center 101')
    ),
    new Event(
      4,
      'Workshop on AI',
      'A hands-on workshop on artificial intelligence.',
      new Date(2024, 8, 20),
      'Opțional',
      '13:00 - 16:00',
      new Organizer(5, new Date(2024, 8, 10), 'AI Labs', 'Technology'),
      new Place(5, 'East', 'City C', 'Innovation Hub 789')
    ),
    new Event(
      5,
      'Hackathon',
      'A 24-hour coding competition.',
      new Date(2024, 8, 14),
      'Opțional',
      '10:00 - 10:00 (next day)',
      new Organizer(6, new Date(2024, 8, 5), 'Code Masters', 'Technology'),
      new Place(6, 'South', 'City E', 'Tech Arena 321')
    ),
    new Event(
      6,
      'Career Fair',
      'A fair to connect students with tech companies.',
      new Date(2024, 8, 25),
      'Obligatoriu',
      '09:00 - 15:00',
      new Organizer(7, new Date(2024, 8, 12), 'Job Connect', 'Recruitment'),
      new Place(7, 'Central', 'City A', 'Career Center 202')
    ),
    new Event(
      7,
      'Cybersecurity Seminar',
      'A seminar on the latest trends in cybersecurity.',
      new Date(2024, 8, 14),
      'Opțional',
      '11:00 - 13:00',
      new Organizer(8, new Date(2024, 8, 15), 'CyberShield', 'Security'),
      new Place(8, 'North', 'City F', 'Security Center 333')
    ),
    new Event(
      8,
      'Startup Pitch',
      'An event where startups pitch their ideas to investors.',
      new Date(2024, 8, 14),
      'Obligatoriu',
      '14:00 - 17:00',
      new Organizer(9, new Date(2024, 8, 18), 'Startup Inc', 'Business'),
      new Place(9, 'West', 'City G', 'Innovation District 101')
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
    if (view === 'month') {
      const dateKey = date.toDateString();
      const eventsForDate = calendarEvents[dateKey] || [];
      const currentDate = new Date();
      const isCurrentMonth = date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();

      if (eventsForDate.length === 0) return null;

      const firstEvent = eventsForDate[0];
      const remainingEvents = eventsForDate.slice(1);
      const mandatoryEvents = remainingEvents.filter(event => event.tip === 'Obligatoriu');
      const optionalEvents = remainingEvents.filter(event => event.tip !== 'Obligatoriu');

      return (
        <div className={`event-container ${!isCurrentMonth ? 'faded-date' : ''}`}>
          <div 
            className={`first-event ${firstEvent.tip === 'Obligatoriu' ? 'mandatory-event' : 'optional-event'}`}
            onClick={(e) => {
              e.stopPropagation();
              handleEventCalendarClick(firstEvent);
            }}
          >
            <p className="event-title">{firstEvent.titlu}</p>
            <p className="event-time">{firstEvent.ora}</p>
          </div>
          <div className="event-indicator">
            {mandatoryEvents.length > 0 && (
              <div 
                className="event-dot mandatory-dot"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventCalendarClick(mandatoryEvents[0]);
                }}
                title={`${mandatoryEvents.length} more mandatory event(s)`}
              >
                {mandatoryEvents.length}
              </div>
            )}
            {optionalEvents.length > 0 && (
              <div 
                className="event-dot optional-dot"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventCalendarClick(optionalEvents[0]);
                }}
                title={`${optionalEvents.length} more optional event(s)`}
              >
                {optionalEvents.length}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleShowAllEvents = (dateKey) => {
    const eventsForDate = calendarEvents[dateKey] || [];
    setFilteredEvents(eventsForDate);
    setSearchPerformed(true);
    setSelectedEvent(null);
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
              <Calendar                         //new
                tileContent={tileContent}
                minDetail="year"
                maxDetail="month"
                navigationLabel={({ date, view }) => 
                  `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
                }
                showNeighboringMonth={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
