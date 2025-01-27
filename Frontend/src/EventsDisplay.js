import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faCalendarDay, faClock, faTag, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StarIcon, DateIcon, PointIcon, ShowMoreIcon, ShowLessButton, ClockIcon, PlaceIcon, OrganizerIcon } from './Icons';

// Helper function for persistent storage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

export const HalfUpcomingEvents = ({ events, expandedEventId, onShowMore, onHideMore, onFavorite, favoritedEvents }) => {
  const [localFavorites, setLocalFavorites] = useLocalStorage('favoritedEvents', favoritedEvents);
  const lastEvents = events.slice(-2);

  useEffect(() => {
    setLocalFavorites(favoritedEvents);
  }, [favoritedEvents]);

  const handleFavorite = (event) => {
    onFavorite(event);
    const newFavorites = localFavorites.some(fav => fav.id === event.id)
      ? localFavorites.filter(fav => fav.id !== event.id)
      : [...localFavorites, event];
    setLocalFavorites(newFavorites);
  };

  const renderEvent = (event, index) => {
    const isMandatory = event.tip === 'Obligatoriu';
    const isFavorited = localFavorites.some(fav => fav.id === event.id);
    const containerClass = isMandatory ? 'mandatory-events-css' : 'optional-events-css';
    const descriptionClass = isMandatory ? 'descriere-css-1' : 'descriere-css-2';

    return (
      <div key={event.id || index} onClick={() => onShowMore(event.id)} className="event-wrapper">
        <div className={containerClass}>
          <div className="event-header">
            <button
              className="favorite-button absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleFavorite(event);
              }}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <StarIcon filled={isFavorited} />
            </button>
          </div>
          
          {/* Rest of your existing event rendering code */}
          <div className={`date-icon-date-css-${isMandatory ? '1' : '2'}`}>
            <DateIcon />
            <p>{event.data.toDateString()}</p>
          </div>
          
          <div className={`point-time-css-${isMandatory ? '1' : '2'}`}>
            <div className={`point-icon-${isMandatory ? '1' : '2'}`}>
              <PointIcon />
            </div>
            <div>
              <p>{event.ora}</p>
            </div>
          </div>

          <div className={`title-css-${isMandatory ? '1' : '2'}`}>
            <h4>{event.titlu}</h4>
          </div>

          {expandedEventId === event.id ? (
            <>
              <div className={descriptionClass}>
                <p>{event.descriere}</p>
              </div>
              <div className="event-detail">
                <FontAwesomeIcon icon={faUser} className="event-detail-icon-1" />
                <span className="event-detail-text-1">{event.organizer.nume}</span>
              </div>
              <div className="event-detail">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="event-detail-icon-1" />
                <span className="event-detail-text-1">
                  {event.place.oras}, {event.place.strada}
                </span>
              </div>
              <div onClick={(e) => {
                e.stopPropagation();
                onHideMore();
              }} className="button-show-less">
                <ShowLessButton />
              </div>
            </>
          ) : (
            <>
              <div className={descriptionClass}>
                <p>{event.descriere.slice(0, 100)}...</p>
              </div>
              <div className="button-show-more">
                <ShowMoreIcon />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="upcoming-events-container">
      <div className="half-of-upcoming-events-css">
        {lastEvents.map(renderEvent)}
      </div>
    </div>
  );
};

export const FilteredEvents = ({ event, onBack, onFavorite, favoritedEvents = [] }) => {
  return (
    <div className="filtered-events-container-div">
      {event ? (
        <div className="filtered-events-container">
          <button onClick={onBack} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <div className="filtered-event-css">
          <div className="event-header">
            {event.id && (
                <button
                  className="favorite-button absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite(event);
                  }}
                  aria-label={
                    favoritedEvents.some((fav) => fav?.id === event?.id) ? 'Remove from favorites' : 'Add to favorites'
                  }
                >
                  <StarIcon filled={favoritedEvents.some((fav) => fav?.id === event?.id)} />
                </button>
              )}
              </div>
            <h4>{event.titlu}</h4>
            <p>{event.descriere}</p>
            <div className="event-detail">
              <FontAwesomeIcon icon={faCalendarDay} className="event-detail-icon" />
              <span className="event-detail-text">{event.data.toDateString()}</span>
            </div>
            <div className="event-detail">
              <FontAwesomeIcon icon={faClock} className="event-detail-icon" />
              <span className="event-detail-text">{event.ora}</span>
            </div>
            <div className="event-detail">
              <FontAwesomeIcon icon={faTag} className="event-detail-icon" />
              <span className="event-detail-text">{event.tip}</span>
            </div>
            <div className="event-detail">
              <FontAwesomeIcon icon={faUser} className="event-detail-icon" />
              <span className="event-detail-text">{event.organizer.nume}</span>
            </div>
            <div className="event-detail">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="event-detail-icon" />
              <span className="event-detail-text">
                {event.place.oras}, {event.place.strada}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p className="no-events-found-css"> No events found.</p>
      )}
    </div>
  );
};

export const DisplayMoreEvents = ({ event, onFavorite, favoritedEvents = [] }) => {
  if (!event) return null;

  const date = event.data instanceof Date ? event.data : new Date(event.data);
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  
  const organizerName = event.organizer?.nume || "Unknown Organizer";
  const location = event.place ? 
    `${event.place.oras || "Unknown City"}, ${event.place.strada || "Unknown Street"}` :
    "Unknown Location";

  return (
    <div className="display-more-events-css">
      <div className="data-ora-div">
        <div className="data-div">
          <div className="date-icon-date-css-1">
            <DateIcon />
          </div>
          <div className="data-css">{formattedDate}</div>
        </div>
        <div className="clock-div">
          <div className="date-icon-date-css-1">
            <ClockIcon />
          </div>
          <div className="ora-css">{event.ora || "No time specified"}</div>
        </div>
      </div>
      <div className={event.tip === 'Obligatoriu' ? 'vertical-bar-red' : 'vertical-bar-blue'}>
        <div 
          className="star-more-items" 
          onClick={(e) => {
            e.stopPropagation();
            onFavorite({...event});
          }}
        >
          <StarIcon filled={favoritedEvents.some(fav => fav.id === event.id)} />
        </div>
        <hr />
      </div>
      <div className="titlu-org-loc-css">
        <h4 className="tile-css-more">{event.titlu}</h4>
        <p className="descriere-css-more">{event.descriere || "No description available"}</p>
        <div className="organizer-css">
          <div className="event-detail-icon-more">
            <OrganizerIcon />
          </div>
          <div className="event-detail-text-more">{organizerName}</div>
        </div>
        <div className="place-css">
          <div className="event-detail-icon-more">
            <PlaceIcon />
          </div>
          <div className="event-detail-text-more">{location}</div>
        </div>
      </div>
    </div>
  );
};

DisplayMoreEvents.defaultProps = {
  favoritedEvents: [],
};

const EventCard = ({ event }) => {
  if (!event) return null;

  const formattedDate = event.data
    ? new Date(event.data).toLocaleDateString("ro-RO")
    : "Unknown Date";

  const organizerName = event.organizer?.nume || "asdfgh";
  const placeDetails = event.place
    ? `${event.place.oras || "Unknown City"}, ${event.place.strada || "Unknown Street"}`
    : "Unknown Location";

  return (
    <div key={event.id} className="display-more-events-css">
      <div className="data-ora-div">
        <div className="data-div">
          <div className="date-icon-date-css-1"><DateIcon /></div>
          <div className="data-css">{formattedDate}</div>
        </div>
        <div className="clock-div">
          <div className="date-icon-date-css-1"><ClockIcon /></div>
          <div className="ora-css">{event.ora || "Unknown Time"}</div>
        </div>
      </div>
      <div className={event.tip === "Obligatoriu" ? "vertical-bar-red" : "vertical-bar-blue"}>
        <hr />
      </div>
      <div className="titlu-org-loc-css">
        <h4 className="tile-css-more">{event.titlu}</h4>
        <p className="descriere-css-more">{event.descriere || "No description available."}</p>
        <div className="organizer-css">
          <div className="event-detail-icon-more"><OrganizerIcon /></div>
          <div className="event-detail-text-more">{organizerName}</div>
        </div>
        <div className="place-css">
          <div className="event-detail-icon-more"><PlaceIcon /></div>
          <div className="event-detail-text-more">{placeDetails}</div>
        </div>
      </div>
    </div>
  );
};

export const DisplayFavEvents = ({ onBack }) => {
  const [favoritedEvents, setFavoritedEvents] = useState([]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("favoritedEvents")) || [];
    setFavoritedEvents(storedEvents);
  }, []);

  if (!favoritedEvents.length) {
    return <p className="no-favorites-text">No favorite events found.</p>;
  }

  return (
    <div className="favorite-events-container">
      <h2 className="favorite-events-title">Favorite Events</h2>
      <div className="more-events-container-css">
        {favoritedEvents.map((event) => (
          <EventCard key={event.id || event.titlu} event={event} />
        ))}
      </div>
      <div className="back-button-container">
        <button onClick={onBack} className="back-button">Back</button>
      </div>
    </div>
  );
};
