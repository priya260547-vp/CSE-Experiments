import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";

import "./App.css";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const times = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
];

const defaultEvents = [
  {
    id: 1,
    title: "React Class",
    day: "Monday",
    time: "9:00 AM",
  },
  {
    id: 2,
    title: "Database Lab",
    day: "Tuesday",
    time: "11:00 AM",
  },
  {
    id: 3,
    title: "Project Meeting",
    day: "Wednesday",
    time: "10:00 AM",
  },
];


// ==========================================
// RENDER MONITOR
// ==========================================

const renderCounts = {};


// ==========================================
// EVENT CARD
// ==========================================

function EventCard({
  event,
  onDelete,
  onEdit,
  onDragStart,
}) {
  if (!renderCounts[event.id]) {
    renderCounts[event.id] = 0;
  }

  renderCounts[event.id] += 1;

  return (
    <div
      className="event-card"
      draggable
      onDragStart={(e) =>
        onDragStart(e, event.id)
      }
    >
      <span className="event-title">
        {event.title}
      </span>

      <div className="event-buttons">

        <button
          className="edit-small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
        >
          ✎
        </button>

        <button
          className="delete-small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event.id);
          }}
        >
          ×
        </button>

      </div>
    </div>
  );
}

const MemoEventCard = memo(EventCard);


// ==========================================
// CALENDAR SLOT
// ==========================================

function CalendarSlot({
  day,
  time,
  eventMap,
  optimized,
  onDrop,
  onDelete,
  onEdit,
  onDragStart,
}) {
  const key = `${day}-${time}`;

  const slotEvents = eventMap[key] || [];

  const EventComponent = optimized
    ? MemoEventCard
    : EventCard;

  return (
    <div
      className="calendar-slot"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, day, time);
      }}
    >

      {slotEvents.length === 0 ? (
        <span className="drop-hint">
          Drop here
        </span>
      ) : (
        slotEvents.map((event) => (
          <EventComponent
            key={event.id}
            event={event}
            onDelete={onDelete}
            onEdit={onEdit}
            onDragStart={onDragStart}
          />
        ))
      )}

    </div>
  );
}

const MemoCalendarSlot =
  memo(CalendarSlot);


// ==========================================
// APP
// ==========================================

function App() {

  const [events, setEvents] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          "interactive-calendar-events"
        );

      return saved
        ? JSON.parse(saved)
        : defaultEvents;

    } catch {
      return defaultEvents;
    }
  });


  const [subject, setSubject] =
    useState("");

  const [selectedDay, setSelectedDay] =
    useState("Monday");

  const [selectedTime, setSelectedTime] =
    useState("9:00 AM");


  const [optimized, setOptimized] =
    useState(true);


  const [parentRenderCount, setParentRenderCount] =
    useState(0);


  const [search, setSearch] =
    useState("");


  const [editingEvent, setEditingEvent] =
    useState(null);


  // ==========================================
  // SAVE EVENTS
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "interactive-calendar-events",
      JSON.stringify(events)
    );
  }, [events]);


  // ==========================================
  // FILTER EVENTS
  // ==========================================

  const filteredEvents = useMemo(() => {

    return events.filter((event) =>
      event.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [events, search]);


  // ==========================================
  // CREATE EVENT MAP
  // ==========================================

  const eventMap = useMemo(() => {

    const map = {};

    filteredEvents.forEach((event) => {

      const key =
        `${event.day}-${event.time}`;

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(event);

    });

    return map;

  }, [filteredEvents]);


  // ==========================================
  // ADD EVENT
  // ==========================================

  const addEvent = useCallback(() => {

    if (!subject.trim()) {
      alert("Please enter a subject.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: subject.trim(),
      day: selectedDay,
      time: selectedTime,
    };

    setEvents((previous) => [
      ...previous,
      newEvent,
    ]);

    setSubject("");

  }, [
    subject,
    selectedDay,
    selectedTime,
  ]);


  // ==========================================
  // DELETE EVENT
  // ==========================================

  const deleteEvent = useCallback(
    (id) => {

      setEvents((previous) =>
        previous.filter(
          (event) => event.id !== id
        )
      );

    },
    []
  );


  // ==========================================
  // EDIT EVENT
  // ==========================================

  const openEdit = useCallback(
    (event) => {
      setEditingEvent({
        ...event,
      });
    },
    []
  );


  const saveEdit = useCallback(() => {

    if (
      !editingEvent ||
      !editingEvent.title.trim()
    ) {
      return;
    }

    setEvents((previous) =>
      previous.map((event) =>
        event.id === editingEvent.id
          ? editingEvent
          : event
      )
    );

    setEditingEvent(null);

  }, [editingEvent]);


  // ==========================================
  // DRAG START
  // ==========================================

  const handleDragStart =
    useCallback(
      (e, id) => {

        e.dataTransfer.setData(
          "eventId",
          String(id)
        );

        e.dataTransfer.effectAllowed =
          "move";

      },
      []
    );


  // ==========================================
  // DROP EVENT
  // ==========================================

  const handleDrop =
    useCallback(
      (e, newDay, newTime) => {

        const id = Number(
          e.dataTransfer.getData(
            "eventId"
          )
        );

        if (!id) return;

        setEvents((previous) =>
          previous.map((event) =>
            event.id === id
              ? {
                  ...event,
                  day: newDay,
                  time: newTime,
                }
              : event
          )
        );

      },
      []
    );


  // ==========================================
  // CLEAR ALL EVENTS
  // ==========================================

  const clearAll = useCallback(() => {

    if (
      window.confirm(
        "Delete all calendar events?"
      )
    ) {
      setEvents([]);
    }

  }, []);


  // ==========================================
  // PERFORMANCE DATA
  // ==========================================

  const totalRenders = Object.values(
    renderCounts
  ).reduce(
    (total, value) => total + value,
    0
  );


  // ==========================================
  // SLOT COMPONENT
  // ==========================================

  const SlotComponent = optimized
    ? MemoCalendarSlot
    : CalendarSlot;


  return (
    <div className="app">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="header">

        <div>

          <div className="eyebrow">
            REACT PERFORMANCE EXPERIMENT
          </div>

          <h1>
            Interactive Calendar
          </h1>

          <p>
            Drag, schedule, optimize and
            analyze React rendering.
          </p>

        </div>

        <div className="calendar-logo">
          📅
        </div>

      </header>


      {/* =====================================
          ADD EVENT
      ====================================== */}

      <section className="add-panel">

        <div className="section-heading">
          <span>＋</span>

          <div>
            <h2>
              Add Schedule
            </h2>

            <p>
              Add a subject to your calendar.
            </p>
          </div>
        </div>


        <div className="add-form">

          <div className="input-group subject-input">

            <label>
              SUBJECT
            </label>

            <input
              type="text"
              placeholder="e.g. Machine Learning"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addEvent();
                }
              }}
            />

          </div>


          <div className="input-group">

            <label>
              DAY
            </label>

            <select
              value={selectedDay}
              onChange={(e) =>
                setSelectedDay(
                  e.target.value
                )
              }
            >
              {days.map((day) => (
                <option
                  key={day}
                  value={day}
                >
                  {day}
                </option>
              ))}
            </select>

          </div>


          <div className="input-group">

            <label>
              TIMING
            </label>

            <select
              value={selectedTime}
              onChange={(e) =>
                setSelectedTime(
                  e.target.value
                )
              }
            >
              {times.map((time) => (
                <option
                  key={time}
                  value={time}
                >
                  {time}
                </option>
              ))}
            </select>

          </div>


          <button
            className="add-button"
            onClick={addEvent}
          >
            + Add Event
          </button>

        </div>

      </section>


      {/* =====================================
          MAIN INFORMATION ROW
      ====================================== */}

      <div className="top-grid">


        {/* SCHEDULE TABLE */}

        <section className="schedule-panel">

          <div className="panel-header">

            <div>
              <h2>
                Schedule Details
              </h2>

              <p>
                Subject and timing information
              </p>
            </div>

            <span className="event-number">
              {events.length} Events
            </span>

          </div>


          <div className="search-wrapper">

            🔍

            <input
              placeholder="Search subject..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="schedule-table">

            <div className="table-row table-head">

              <span>
                SUBJECT
              </span>

              <span>
                DAY
              </span>

              <span>
                TIMING
              </span>

              <span>
                ACTION
              </span>

            </div>


            {filteredEvents.length === 0 ? (

              <div className="empty-table">
                No events found.
              </div>

            ) : (

              filteredEvents.map((event) => (

                <div
                  className="table-row"
                  key={event.id}
                >

                  <strong>
                    {event.title}
                  </strong>

                  <span>
                    {event.day}
                  </span>

                  <span>
                    {event.time}
                  </span>

                  <div className="table-actions">

                    <button
                      onClick={() =>
                        openEdit(event)
                      }
                    >
                      ✎
                    </button>

                    <button
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                    >
                      ×
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>


          {events.length > 0 && (

            <button
              className="clear-all"
              onClick={clearAll}
            >
              Clear All Events
            </button>

          )}

        </section>


        {/* ==================================
            OPTIMIZATION PANEL
        =================================== */}

        <section className="performance-panel">

          <div className="performance-title">

            <div>
              <span>
                ⚡ PERFORMANCE LAB
              </span>

              <h2>
                Render Optimization
              </h2>

              <p>
                Compare React rendering
                behaviour.
              </p>
            </div>

            <div className="speed-icon">
              ⚡
            </div>

          </div>


          <div className="optimization-control">

            <div>

              <strong>
                Optimization
              </strong>

              <small>
                React.memo + useMemo +
                useCallback
              </small>

            </div>


            <button
              className={
                optimized
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                setOptimized(
                  (value) => !value
                )
              }
            >

              <span></span>

              {optimized
                ? "ON"
                : "OFF"}

            </button>

          </div>


          <div className="metrics">

            <div className="metric">

              <strong>
                {parentRenderCount}
              </strong>

              <span>
                Parent Updates
              </span>

            </div>


            <div className="metric">

              <strong>
                {totalRenders}
              </strong>

              <span>
                Event Renders
              </span>

            </div>


            <div className="metric">

              <strong>
                {optimized
                  ? "Memoized"
                  : "Normal"}
              </strong>

              <span>
                Render Mode
              </span>

            </div>

          </div>


          <button
            className="render-test"
            onClick={() =>
              setParentRenderCount(
                (value) => value + 1
              )
            }
          >
            Test Parent Re-render
          </button>


          <div className="optimization-note">

            <span>
              💡
            </span>

            <p>
              Turn optimization OFF and
              trigger a re-render. Then
              turn it ON and repeat to
              compare unnecessary renders.
            </p>

          </div>

        </section>

      </div>


      {/* =====================================
          CALENDAR
      ====================================== */}

      <section className="calendar-section">

        <div className="calendar-section-header">

          <div>

            <span>
              WEEKLY SCHEDULE
            </span>

            <h2>
              Interactive Calendar
            </h2>

          </div>


          <div className="drag-instruction">
            ↔ Drag events between slots
          </div>

        </div>


        <div className="calendar-wrapper">

          <div className="calendar">

            {/* HEADER */}

            <div className="calendar-header">

              <div className="time-heading">
                TIME
              </div>

              {days.map((day) => (

                <div
                  className="day-heading"
                  key={day}
                >

                  <strong>
                    {day.substring(0, 3)}
                  </strong>

                  <span>
                    {day}
                  </span>

                </div>

              ))}

            </div>


            {/* ROWS */}

            {times.map((time) => (

              <div
                className="calendar-row"
                key={time}
              >

                <div className="time-column">

                  <strong>
                    {time}
                  </strong>

                </div>


                {days.map((day) => (

                  <SlotComponent
                    key={`${day}-${time}`}
                    day={day}
                    time={time}
                    eventMap={eventMap}
                    optimized={optimized}
                    onDrop={handleDrop}
                    onDelete={deleteEvent}
                    onEdit={openEdit}
                    onDragStart={
                      handleDragStart
                    }
                  />

                ))}

              </div>

            ))}

          </div>

        </div>


        <div className="calendar-footer">

          <div>
            <span className="legend-dot"></span>
            Scheduled Event
          </div>

          <div>
            <span className="legend-drag">
              ↔
            </span>
            Drag & Drop
          </div>

          <div>
            <span>💡</span>
            Drop an event into any
            available slot
          </div>

        </div>

      </section>


      {/* =====================================
          EDIT MODAL
      ====================================== */}

      {editingEvent && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <span>
                  EDIT EVENT
                </span>

                <h2>
                  Update Schedule
                </h2>
              </div>

              <button
                onClick={() =>
                  setEditingEvent(null)
                }
              >
                ×
              </button>

            </div>


            <label>
              SUBJECT
            </label>

            <input
              value={editingEvent.title}
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  title: e.target.value,
                })
              }
            />


            <label>
              DAY
            </label>

            <select
              value={editingEvent.day}
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  day: e.target.value,
                })
              }
            >

              {days.map((day) => (

                <option
                  key={day}
                  value={day}
                >
                  {day}
                </option>

              ))}

            </select>


            <label>
              TIMING
            </label>

            <select
              value={editingEvent.time}
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  time: e.target.value,
                })
              }
            >

              {times.map((time) => (

                <option
                  key={time}
                  value={time}
                >
                  {time}
                </option>

              ))}

            </select>


            <button
              className="save-button"
              onClick={saveEdit}
            >
              Save Changes
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;