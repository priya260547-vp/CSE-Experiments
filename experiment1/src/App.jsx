import { useState } from "react";
import "./App.css";

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [content, setContent] = useState("");
  const [drafts, setDrafts] = useState([]);
const [editingId, setEditingId] = useState(null);
  const limits = {
    Twitter: 280,
    LinkedIn: 3000,
    Instagram: 2200,
  };

  const limit = limits[platform];
  const remaining = limit - content.length;

  const percentage = (content.length / limit) * 100;
// Check if character limit is exceeded
const isExceeded = content.length > limit;

// Decide the progress bar color
const progressColor =
  percentage > 100
    ? "#ef4444"   // Red
    : percentage > 80
    ? "#f59e0b"   // Orange
    : "#22c55e";  // Green
    const saveDraft = () => {

  if (content.trim() === "") {
    alert("Please write something first!");
    return;
  }

  if (editingId !== null) {

    const updatedDrafts = drafts.map((draft) =>
      draft.id === editingId
        ? { ...draft, platform, content }
        : draft
    );

    setDrafts(updatedDrafts);

    setEditingId(null);

  } else {

    const newDraft = {
      id: Date.now(),
      platform,
      content,
    };

    setDrafts([...drafts, newDraft]);

  }

  setContent("");
  setPlatform("Twitter");
};
const deleteDraft = (id) => {
  const updatedDrafts = drafts.filter((draft) => draft.id !== id);
  setDrafts(updatedDrafts);
};
const editDraft = (draft) => {
  setPlatform(draft.platform);
  setContent(draft.content);
  setEditingId(draft.id);
};

  return (
    <div className="main">
      <div className="card">

        <h1>📝 Post Composer</h1>
        <p className="subtitle">
          Create posts for different social media platforms
        </p>

        <label>Select Platform</label>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option>Twitter</option>
          <option>LinkedIn</option>
          <option>Instagram</option>
        </select>

        <label>Write Your Post</label>

        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <div className="counter">
          <span>Characters: {content.length}/{limit}</span>
          <span>Remaining: {remaining}</span>
        </div>

        <div className="progress">
  <div
    className="progress-bar"
    style={{
      width: `${Math.min(percentage, 100)}%`,
      background: progressColor,
    }}
  ></div>
</div>
{isExceeded && (
  <p className="error">
    ❌ Character limit exceeded! Please reduce your text.
  </p>
)}

<button
  disabled={isExceeded}
  onClick={saveDraft}
>
  {editingId !== null ? "✅ Update Draft" : "💾 Save Draft"}
</button>
<h2 className="draftTitle">📂 Saved Drafts</h2>

{
  drafts.length === 0 ? (
    <p className="empty">
      No drafts available.
    </p>
  ) : (

    drafts.map((draft) => (

      <div className="draftCard" key={draft.id}>

  <h3>{draft.platform}</h3>

  <p>{draft.content}</p>

  <div className="buttons">

    <button
      className="editBtn"
      onClick={() => editDraft(draft)}
    >
      ✏ Edit
    </button>

    <button
      className="deleteBtn"
      onClick={() => deleteDraft(draft.id)}
    >
      🗑 Delete
    </button>

  </div>

</div>

    ))

  )
}

      </div>
    </div>
  );
}

export default App;