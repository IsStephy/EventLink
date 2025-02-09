import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { HalfUpcomingEvents, FilteredEvents, DisplayMoreEvents, DisplayFavEvents } from './EventsDisplay';
import { SearchIcon, CalendarIcon, StarIcon } from './Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { Event, Organizer, Place } from './EventModels';
import logo from './images/utm_logo.png';
import { LoginPage } from './Login';
import './Login.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [events, setEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [clickedEvents, setClickedEvents] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [error, setError] = useState(null);
  const [userEmail] = useState(localStorage.getItem('userEmail')); 
  const [favoritedEvents, setFavoritedEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('favoritedEvents');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  const [isViewingFavorites, setIsViewingFavorites] = useState(false);


  useEffect(() => {
    const fetchAndOrganizeEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/events/interval?start_date=2024-09-01&end_date=2025-09-30');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

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
            'utm1',
            'Sesiune de Cercetare și Inovație',
            'Eveniment dedicat prezentării rezultatelor cercetărilor recente și inovațiilor din diverse domenii tehnice.',
            new Date('2024-09-25T10:00:00'),
            'Obligatoriu',
            '10:00 - 13:00',
            new Organizer('utm_org1', null, 'Universitatea Tehnică a Moldovei', 'Cercetare și Inovație'),
            new Place('utm_place1', 'Centru', 'Chișinău', 'Strada Mihai Eminescu 45')
          ),
          new Event(
            'utm2',
            'Workshop de Programare Avansată',
            'Workshop intensiv pe subiecte avansate de programare, inclusiv tehnici de optimizare și noi framework-uri.',
            new Date('2024-09-25T12:00:00'),
            'Optional',
            '12:00 - 13:00',
            new Organizer('utm_org2', null, 'Universitatea Tehnică a Moldovei', 'IT și Programare'),
            new Place('utm_place2', 'Buiucani', 'Chișinău', 'Strada Alba Iulia 75')
          ),
          new Event(
            'utm3',
            'Expoziție de Proiecte de Diplomă',
            'Expoziție anuală în care studenții își prezintă proiectele de diplomă și cercetările în domeniul tehnologiei și ingineriei.',
            new Date('2024-09-25T14:00:00'),
            'Obligatoriu',
            '14:00 - 17:00',
            new Organizer('utm_org3', null, 'Universitatea Tehnică a Moldovei', 'Facultatea de Inginerie'),
            new Place('utm_place3', 'Centru', 'Chișinău', 'Strada Dacia 32')
          ),
          new Event(
            'utm4',
            'Conferința Națională de Tehnologii Emergentă',
            'Conferință dedicată noilor tehnologii emergente și impactul lor asupra industriei și educației.',
            new Date('2024-09-25T16:00:00'),
            'Optional',
            '16:00 - 17:30',
            new Organizer('utm_org4', null, 'Universitatea Tehnică a Moldovei', 'Tehnologie și Inovație'),
            new Place('utm_place4', 'Telecentru', 'Chișinău', 'Strada Miorița 16')
          ),
          new Event(
            'utm5',
            'Seminar de Cybersecurity',
            'Seminar dedicat celor mai recente dezvoltări în securitatea cibernetică și măsurilor de protecție a datelor.',
            new Date('2024-09-25T18:00:00'),
            'Obligatoriu',
            '18:00 - 19:00',
            new Organizer('utm_org5', null, 'Universitatea Tehnică a Moldovei', 'Securitate Cibernetică'),
            new Place('utm_place5', 'Râșcani', 'Chișinău', 'Strada Tighina 25')
          )
        ];        

        const allEvents = [...transformedEvents, ...customEvents];

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
        setError(null);

      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/favorites');
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const data = await response.json();
        
        // Merge with existing local favorites
        const mergedFavorites = [...new Map([
          ...favoritedEvents,
          ...data
        ].map(event => [event.id, event])).values()];
        
        setFavoritedEvents(mergedFavorites);
        localStorage.setItem('favoritedEvents', JSON.stringify(mergedFavorites));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchAndOrganizeEvents();
    fetchFavorites();
  }, [favoritedEvents.length]);

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
    setClickedEvents([]);
    setIsViewingFavorites(false);
    setInputValue('');
  };

  const handleEventCalendarClick = (event) => {
    setSelectedEvent(event);
    setIsViewingFavorites(false);
    setSearchPerformed(false);
    setClickedEvents([]);
  };

  const handleShowAllEvents = (events) => {
    setClickedEvents(events);
    setIsViewingFavorites(false);
    setSelectedEvent(null);
    setSearchPerformed(false);
    setFilteredEvents([]);
    setExpandedEventId(null);
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
          <div className="event-details-container">
            {firstEvent && (
              <div 
                className={`event-details ${firstEvent.tip === 'Obligatoriu' ? 'mandatory-event' : 'optional-event'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventCalendarClick(firstEvent);
                }}
              >
                <div className='event-div-calendar-tile-css'>
                  <p className="event-title">{firstEvent.titlu}</p>
                  <p className='helpful-p-css'></p>
                  <p className="event-time">{firstEvent.ora}</p>
                </div>
              </div>
            )}
            <div className="event-indicator">
              {mandatoryEvents.length > 0 && (
                <div 
                  className="event-dot mandatory-dot"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowAllEvents(mandatoryEvents);
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
                    handleShowAllEvents(optionalEvents);
                  }}
                  title={`${optionalEvents.length} more optional event(s)`}
                >
                  {optionalEvents.length}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderClickedEvents = () => {
    if (clickedEvents.length > 0) {
      return (
        <>
          <div className='more-events-container-css'>
            {clickedEvents.map((event, index) => (
              <DisplayMoreEvents 
              key={index}
              event={event} 
              onFavorite={handleFavorite} 
              favoritedEvents={favoritedEvents}
              />
            ))}
          </div>
          <div className="back-button-container">
            <button onClick={handleBackClick} className="back-button">
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
          </div>
        </>
      );
    }
    return null;
  };

  const handleBackClick = () => {
    setSearchPerformed(false);
    setSelectedEvent(null);
    setClickedEvents([]);
    setFilteredEvents([]);
  };

  const handleShowMore = (eventId) => {
    setExpandedEventId(eventId);
  };

  const handleHideMore = () => {
    setExpandedEventId(null);
  };

  const handleFavorite = async (event) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event.id
        })
      });
  
      if (!response.ok) throw new Error('Failed to toggle favorite');
  
      setFavoritedEvents(prev => {
        const isCurrentlyFavorited = prev.some(fav => fav.id === event.id);
        const newFavorites = isCurrentlyFavorited
          ? prev.filter(fav => fav.id !== event.id)
          : [...prev, {...event}];
        
        localStorage.setItem('favoritedEvents', JSON.stringify(newFavorites));
        return newFavorites;
      });
  
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Fallback to local toggle if API fails
      setFavoritedEvents(prev => {
        const isCurrentlyFavorited = prev.some(fav => fav.id === event.id);
        const newFavorites = isCurrentlyFavorited
          ? prev.filter(fav => fav.id !== event.id)
          : [...prev, {...event}];
        
        localStorage.setItem('favoritedEvents', JSON.stringify(newFavorites));
        return newFavorites;
      });
    }
  };

  const renderUpcomingEvents = () => {
    return (
      <div className="upcoming-events-section">
        <h2 className="upcoming-events-text-css">
          Upcoming Events
          {favoritedEvents.length > 0 && (
          <button
          className="upcoming-events-star"
          onClick={() => {
            setClickedEvents([]);
            setSearchPerformed(false);
            setSelectedEvent(null);
            setFilteredEvents([]);
            setExpandedEventId(null);
            setIsViewingFavorites(true);
          }}
        >
            <StarIcon filled={true} />
          </button>
          )}
        </h2>
        <HalfUpcomingEvents
          events={events}
          expandedEventId={expandedEventId}
          onShowMore={handleShowMore}
          onHideMore={handleHideMore}
          onFavorite={handleFavorite}
          favoritedEvents={favoritedEvents}
        />
      </div>
    );
  };

  return (
    <Router>
      <Routes>
      <Route
  path="/home"
  element={
    <div className="purple-container-css">
      <div className="gradient-background">
        <div className="calendar-and-upc-events-css">
          <div className="upcoming-events-or-events-from-calendar">
            {error && <p className="error-message">{error}</p>}
            {isViewingFavorites ? (
              <DisplayFavEvents
                favoritedEvents={favoritedEvents}
                onBack={() => setIsViewingFavorites(false)}
              />
            ) : (
              <>
                {clickedEvents.length > 0 ? (
                  renderClickedEvents()
                ) : (
                  <>
                    {!searchPerformed && !selectedEvent && renderUpcomingEvents()}
                    {searchPerformed && filteredEvents.length === 1 && (
                      <>
                        <h2 className="search-results-text-css">
                          Search results
                        </h2>
                        <FilteredEvents
                          key={filteredEvents[0].id}
                          event={filteredEvents[0]}
                          onBack={handleBackClick}
                        />
                      </>
                    )}
                    {searchPerformed && filteredEvents.length > 1 && (
                      <>
                        <h2 className="search-results-text-css">
                          Search results
                        </h2>
                        <div className="more-events-container-css">
                          {filteredEvents.map((event, index) => (
                            <DisplayMoreEvents
                              key={index}
                              event={event}
                              onFavorite={handleFavorite} 
                              isFavorited={favoritedEvents.includes(event)}
                            />
                          ))}
                        </div>
                        <div className="back-button-container">
                          <button
                            onClick={handleBackClick}
                            className="back-button"
                          >
                            <FontAwesomeIcon icon={faArrowLeft} /> Back
                          </button>
                        </div>
                      </>
                    )}
                    {searchPerformed && filteredEvents.length === 0 && (
                      <p className="no-events-found-css">No events found.</p>
                    )}
                    {selectedEvent && (
                      <FilteredEvents
                        event={selectedEvent}
                        onBack={handleBackClick}
                        onFavorite={handleFavorite}
                        favoritedEvents={favoritedEvents}
                        isFavorited={favoritedEvents.includes(selectedEvent)}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="calendar-section">
            <div className="search-icon-text-css">
              <div className="logo-icon-css"></div>
              <img
                src={logo}
                alt="UTM Logo"
                className="utm-logo-css"
                onClick={() => {
                  setSelectedEvent(null);
                  setSearchPerformed(false);
                  setClickedEvents([]);
                  setFilteredEvents([]);
                  setExpandedEventId(null);
                  setIsViewingFavorites(false);
                }}
              />
              <div className="icon-calendar-text-css">
                <CalendarIcon
                  onClick={() => {
                    setSelectedEvent(null);
                    setSearchPerformed(false);
                    setClickedEvents([]);
                    setFilteredEvents([]);
                    setExpandedEventId(null);
                    setIsViewingFavorites(false);
                  }}
                />
                <div className="calendar-text-css">Calendar</div>
              </div>
              <div className="search-bar-css">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-search-css"
                  placeholder="Search for event"
                />
                <button
                  className="button-search-icon-css"
                  onClick={handleSearchClick}
                >
                  <SearchIcon />
                </button>
              </div>
            </div>
            <hr className="line-css" />
            <div className="calendar-css">
              <Calendar
                tileContent={tileContent}
                minDetail="year"
                maxDetail="month"
                navigationLabel={({ date }) =>
                  `${date.toLocaleString('default', {
                    month: 'long',
                  })} ${date.getFullYear()}`
                }
                onClickDay={() => setSelectedEvent(null)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  }
/>


        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;