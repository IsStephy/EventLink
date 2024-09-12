import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { HalfUpcomingEvents, FilteredEvents } from './EventsDisplay';
import { SearchIcon, CalendarIcon } from './Icons';
import './App.css';
import { Event, Organizer, Place } from './EventModels';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [events, setEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);

  useEffect(() => {
    const fetchAndOrganizeEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/events/interval?start_date=2024-09-01&end_date=2025-09-30');
        const data = await response.json();
        
        console.log(data); 
  
        const transformedEvents = data.map(event => 
          new Event(
            event.id,
            event.titlu,
            event.descriere,
            new Date(event.data),
            event.tip.charAt(0).toUpperCase() + event.tip.slice(1), 
            event.ora,
            new Organizer(null, null, event.organizator.nume, event.organizator.domeniu),
            new Place(null, event.loc.raion, event.loc.oras, event.loc.strada)
          )
        );
  
        const customEvents = [
          new Event(
            'custom1',
            'Event 1',
            'Description for Event 1',
            new Date('2024-09-15T09:00:00'),  
            'Obligatoriu',
            '09:00',
            new Organizer('org1', null, 'Organizer 1', 'Field 1'),
            new Place('place1', 'District 1', 'City 1', 'Street 1')
          ),
          new Event(
            'custom2',
            'Event 2',
            'Description for Event 2',
            new Date('2024-09-15T11:00:00'),  
            'Optional',
            '11:00',
            new Organizer('org2', null, 'Organizer 2', 'Field 2'),
            new Place('place2', 'District 2', 'City 2', 'Street 2')
          ),
          new Event(
            'custom3',
            'Event 3',
            'Description for Event 3',
            new Date('2024-09-15T14:00:00'),  
            'Obligatoriu',
            '14:00',
            new Organizer('org3', null, 'Organizer 3', 'Field 3'),
            new Place('place3', 'District 3', 'City 3', 'Street 3')
          )
        ];
  
        // Combine API events with custom events
        const allEvents = [...transformedEvents, ...customEvents];
  
        // Create calendarEvents structure
        const newCalendarEvents = allEvents.reduce((acc, event) => {
          const dateKey = event.data.toDateString();
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(event);
          return acc;
        }, {});
  
        setEvents(allEvents);
        setCalendarEvents(newCalendarEvents);
  
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchAndOrganizeEvents();
  }, []);

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
              <Calendar
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