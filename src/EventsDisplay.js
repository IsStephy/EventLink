import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faChevronDown, faChevronUp, faCalendarDay, faClock, faTag, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { StarIcon, DateIcon, PointIcon, ShowMoreIcon, ShowLessButton, VerticalBar, ClockIcon, PlaceIcon, OrganizerIcon } from './Icons';
import { faCalendarAlt, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Place } from './EventModels';

export const EventCard = ({ event, onFavorite, isFavorited, onClick }) => {
  return (
    <div 
      className={`event-card ${event.tip === 'Obligatoriu' ? 'mandatory-event' : 'optional-event'}`}
      onClick={onClick}
    >
      <div className="event-header">
        <h3 className="event-title">{event.titlu}</h3>
        <button
          className="favorite-button"
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(event);
          }}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <StarIcon filled={isFavorited} />
        </button>
      </div>
      <p className="event-time">{event.ora}</p>
      <p className="event-location">{event.place?.oras}, {event.place?.strada}</p>
      <p className="event-type">{event.tip}</p>
    </div>
  );
};

export const HalfUpcomingEvents = ({ events, expandedEventId, onShowMore, onHideMore, onFavorite,
  favoritedEvents }) => {
  const lastEvents = events.slice(-2);
  let arrayEventTypes = [];

  lastEvents.forEach((event, index) => {
    arrayEventTypes[index] = event.tip === 'Obligatoriu';
  });

  return (
    <div className="upcoming-events-container">
      <div className="events-list">
        {lastEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onFavorite={onFavorite}
            isFavorited={favoritedEvents.some(fav => fav.id === event.id)}
            onClick={() => onShowMore(event.id)}
          />
        ))}
      </div>
    <div className='half-of-upcoming-events-css'>
      {lastEvents.map((event, index) => (
        <div key={index}>
          {arrayEventTypes[index] ? (
            <div className='mandatory-events-css'>
              <div className='date-icon-date-css-1'>
                <DateIcon />
                <p>{event.data.toDateString()}</p>
              </div>
              <div className='point-time-css-1'>
                <div className='point-icon-1'> <PointIcon /> </div>
                <div> <p>{event.ora}</p> </div>
              </div>
              <div className='title-css-1'>
                <h4>{event.titlu}</h4>
              </div>
              {expandedEventId === event.id ? (
                <>
                  <div className='descriere-css-1'>
                    <p>{event.descriere}</p>
                  </div>
                  <div className="event-detail">
                    <FontAwesomeIcon icon={faUser} className="event-detail-icon-1" />
                    <span className="event-detail-text-1">{event.organizer.nume}</span>
                  </div>
                  <div className="event-detail">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="event-detail-icon-1" />
                    <span className="event-detail-text-1">{event.place.oras}, {event.place.strada}</span>
                  </div>
                  <div onClick={onHideMore} className='button-show-less'>
                    <ShowLessButton />
                  </div>
                </>
              ) : (
                <>
                  <div className='descriere-css-1'>
                    <p>{event.descriere.slice(0, 100)}...</p>
                  </div>
                  <div onClick={() => onShowMore(event.id)} className='button-show-more'>
                    <ShowMoreIcon />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className='optional-events-css'>
              <div className='date-icon-date-css-2'>
                <DateIcon />
                <p>{event.data.toDateString()}</p>
              </div>
              <div className='point-time-css-2'>
                <div className='point-icon-2'> <PointIcon /> </div>
                <div> <p>{event.ora}</p> </div>
              </div>
              <div className='title-css-2'>
                <h4>{event.titlu}</h4>
              </div>
              {expandedEventId === event.id ? (
                <>
                  <div className='descriere-css-2'>
                    <p>{event.descriere}</p>
                  </div>
                  <div className="event-detail">
                    <FontAwesomeIcon icon={faUser} className="event-detail-icon-1" />
                    <span className="event-detail-text-1">{event.organizer.nume}</span>
                  </div>
                  <div className="event-detail">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="event-detail-icon-1" />
                    <span className="event-detail-text-1">{event.place.oras}, {event.place.strada}</span>
                  </div>
                  <div onClick={onHideMore} className='button-show-less'>
                    <ShowLessButton />
                  </div>
                </>
              ) : (
                <>
                  <div className='descriere-css-2'>
                    <p>{event.descriere.slice(0, 100)}...</p>
                  </div>
                  <div onClick={() => onShowMore(event.id)} className='button-show-more'>
                    <ShowMoreIcon />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}

export const FilteredEvents = ({ event, onBack }) => {
  return (
    <div className='filtered-events-container-div'>
      {event ? (
        <div className="filtered-events-container">
          <button onClick={onBack} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <div className='filtered-event-css'>
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
              <span className="event-detail-text">{event.place.oras}, {event.place.strada}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className='no-events-found-css'> No events found.</p>
      )}
    </div>
  );
}

export const DisplayMoreEvents = ({ event }) => {
  // Create a date object
  const date = new Date(event.data);

  // Format the date as "dd.mm.yyyy"
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

  return (
    <div className='display-more-events-css'>
      <div className='data-ora-div'>
        <div className='data-div'>
          <div className='date-icon-date-css-1'> <DateIcon /> </div>
          <div className='data-css'>{formattedDate}</div>
        </div>
        <div className='clock-div'>
          <div className='date-icon-date-css-1'><ClockIcon /></div>
          <div className='ora-css'> {event.ora}</div>
        </div>
      </div>

      {event.tip === 'Obligatoriu' ? (
        <div className='vertical-bar-red'><hr /></div>
      ) : (
        <div className='vertical-bar-blue'><hr /></div>
      )}

      <div className='titlu-org-loc-css'>
        <h4 className='tile-css-more'>{event.titlu}</h4>
        <p className='descriere-css-more'>{event.descriere}</p>
        <div className='organizer-css'>
          <div className='event-detail-icon-more'><OrganizerIcon /></div>
          <div className='event-detail-text-more'>{event.organizer.nume}</div>
        </div>
        <div className='place-css'>
          <div className='event-detail-icon-more'><PlaceIcon /></div>
          <div className='event-detail-text-more'>{event.place.oras}, {event.place.strada}</div>
        </div>
      </div>
    </div>
  );
}