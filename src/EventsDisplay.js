import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faChevronDown, faChevronUp, faCalendarDay, faClock, faTag, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { DateIcon, PointIcon, ShowMoreIcon, ShowLessButton } from './Icons';
import { faCalendarAlt, faCircle } from '@fortawesome/free-solid-svg-icons';

export const HalfUpcomingEvents = ({ events, expandedEventId, onShowMore, onHideMore }) => {
    const lastEvents = events.slice(-2);
    let arrayEventTypes = [];
  
    lastEvents.forEach((event, index) => {
      arrayEventTypes[index] = event.tip === 'Obligatoriu';
    });
  
    return (
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
                  <div className='point-icon-1'> <PointIcon/> </div>
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
                  <div className='point-icon-2'> <PointIcon/> </div>
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
    );
  }

export const FilteredEvents = ({ event, onBack }) => {
    return (
      <div>
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
  