import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faChevronDown,faChevronUp, faCalendarDay, faClock, faTag, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { StarIcon, DateIcon, PointIcon, ShowMoreIcon, ShowLessButton, VerticalBar, ClockIcon, PlaceIcon, OrganizerIcon} from './Icons';

export const HalfUpcomingEvents = ({ events, expandedEventId, onShowMore, onHideMore, onFavorite, favoritedEvents }) => {
  const lastEvents = events.slice(-2); // Get the last two events to display.
  const arrayEventTypes = lastEvents.map((event) => event.tip === 'Obligatoriu');

  return (
    <div className="upcoming-events-container">
      <div className="half-of-upcoming-events-css">
        {lastEvents.map((event, index) => (
          <div
            key={index}
            onClick={() => onShowMore(event.id)}
            className={`event-wrapper`}
          >
            {arrayEventTypes[index] ? (
              <div className="mandatory-events-css">
                <div className="event-header">
                <button
                    className="favorite-button absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(event);
                    }}
                    aria-label={
                      favoritedEvents.some((fav) => fav.id === event.id) ? 'Remove from favorites' : 'Add to favorites'
                    }
                  >
                    <StarIcon filled={favoritedEvents.some((fav) => fav.id === event.id)} />
                  </button>
                </div>
                <div className="date-icon-date-css-1">
                  <DateIcon />
                  <p>{event.data.toDateString()}</p>
                </div>
                <div className="point-time-css-1">
                  
                  <div className="point-icon-1">
                    <PointIcon />
                  </div>
                  <div>
                    <p>{event.ora}</p>
                  </div>
                </div>
                <div className="title-css-1">
                    <h4>{event.titlu}</h4>
                  </div>
                {expandedEventId === event.id ? (
                  <>
                    <div className="descriere-css-1">
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
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onHideMore();
                      }}
                      className="button-show-less"
                    >
                      <ShowLessButton />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="descriere-css-1">
                      <p>{event.descriere.slice(0, 100)}...</p>
                    </div>
                    <div className="button-show-more">
                      <ShowMoreIcon />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="optional-events-css">
                <div className="event-header">
                  <button
                    className="favorite-button absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(event);
                    }}
                    aria-label={
                      favoritedEvents.some((fav) => fav.id === event.id) ? 'Remove from favorites' : 'Add to favorites'
                    }
                  >
                    <StarIcon filled={favoritedEvents.some((fav) => fav.id === event.id)} />
                  </button>
                </div>
                <div className="date-icon-date-css-2">
                  <DateIcon />
                  <p>{event.data.toDateString()}</p>
                </div>
                <div className="point-time-css-2">
                  <div className="point-icon-2">
                    <PointIcon />
                  </div>
                  <div>
                    <p>{event.ora}</p>
                  </div>
                </div>
                <div className="title-css-2">
                    <h4>{event.titlu}</h4>
                  </div>
                {expandedEventId === event.id ? (
                  <>
                    <div className="descriere-css-2">
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
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onHideMore();
                      }}
                      className="button-show-less"
                    >
                      <ShowLessButton />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="descriere-css-2">
                      <p>{event.descriere.slice(0, 100)}...</p>
                    </div>
                    <div className="button-show-more">
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
  if (!event || !event.place) {
    return <div className="error">Event details are missing or incomplete.</div>;
  }

  const date = new Date(event.data);
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

  // Ensure favoritedEvents is always defined as an array
  const isFavorited = favoritedEvents.some((fav) => fav.id === event.id);

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
          <div className="ora-css">{event.ora}</div>
        </div>
      </div>
      {event.tip === 'Obligatoriu' ? (
        <div className="vertical-bar-red">
          <div 
            className="star-more-items" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent click propagation
              onFavorite(event);   // Trigger the favorite toggle function
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <StarIcon filled={isFavorited} />
          </div>
          <hr />
        </div>
      ) : (
        <div className="vertical-bar-blue">
          <div 
            className="star-more-items" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent click propagation
              onFavorite(event);   // Trigger the favorite toggle function
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <StarIcon filled={isFavorited} />
          </div>
          <hr />
        </div>
      )}
      <div className="titlu-org-loc-css">
        <h4 className="tile-css-more">{event.titlu}</h4>
        <p className="descriere-css-more">{event.descriere}</p>
        <div className="organizer-css">
          <div className="event-detail-icon-more">
            <OrganizerIcon />
          </div>
          <div className="event-detail-text-more">{event.organizer.nume}</div>
        </div>
        <div className="place-css">
          <div className="event-detail-icon-more">
            <PlaceIcon />
          </div>
          <div className="event-detail-text-more">
            {event.place.oras}, {event.place.strada}
          </div>
        </div>
      </div>
    </div>
  );
};

DisplayMoreEvents.defaultProps = {
  favoritedEvents: [],
};

export const DisplayFavEvents = ({ favoritedEvents, onBack }) => {
  if (favoritedEvents.length === 0) {
    return <p className="no-favorites-text">No favorite events found.</p>;
  }

  return (
    <div className="favorite-events-container">
      <h2 className="favorite-events-title">Favorite Events</h2>
      <div className="more-events-container-css">
        {favoritedEvents.map((event) => (
          <div key={event.id} className="display-more-events-css">
            {/* Date and Time */}
            <div className="data-ora-div">
              <div className="data-div">
                <div className="date-icon-date-css-1">
                  <DateIcon />
                </div>
                <div className="data-css">
                  {new Date(event.data).toLocaleDateString('ro-RO')}
                </div>
              </div>
              <div className="clock-div">
                <div className="date-icon-date-css-1">
                  <ClockIcon />
                </div>
                <div className="ora-css">{event.ora}</div>
              </div>
            </div>

            {/* Type Indicator */}
            {event.tip === 'Obligatoriu' ? (
              <div className="vertical-bar-red">
                <hr />
              </div>
            ) : (
              <div className="vertical-bar-blue">
                <hr />
              </div>
            )}

            {/* Event Details */}
            <div className="titlu-org-loc-css">
              <h4 className="tile-css-more">{event.titlu}</h4>
              <p className="descriere-css-more">{event.descriere}</p>
              <div className="organizer-css">
                <div className="event-detail-icon-more">
                  <OrganizerIcon />
                </div>
                <div className="event-detail-text-more">
                  {event.organizer.nume}
                </div>
              </div>
              <div className="place-css">
                <div className="event-detail-icon-more">
                  <PlaceIcon />
                </div>
                <div className="event-detail-text-more">
                  {event.place.oras}, {event.place.strada}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="back-button-container">
        <button onClick={onBack} className="back-button">
          Back
        </button>
      </div>
    </div>
  );
};
