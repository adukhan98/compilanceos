import { useState } from 'react';
import { Search, BookOpen, Trash2, Edit2, X, Check, Hash } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export function AnswerLibrary() {
  const { state, deleteAnswer, updateAnswer, searchAnswers } = useStore();
  const { answers } = state;
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const filteredAnswers = search ? searchAnswers(search) : answers;

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id: string) => {
    const answer = answers.find(a => a.id === id);
    if (answer && editText.trim()) {
      updateAnswer({ ...answer, answerText: editText.trim() });
    }
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="answer-library">
      <header className="page-header">
        <div>
          <h1>Answer Library</h1>
          <p className="text-secondary mt-sm">
            Your saved answers for quick reuse in questionnaires
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <BookOpen size={16} />
            <span>{answers.length} answers</span>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="search-section">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Search by question, answer, or keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Answers List */}
      {filteredAnswers.length === 0 ? (
        <div className="empty-state">
          <BookOpen className="empty-state-icon" />
          <h3 className="empty-state-title">
            {search ? 'No answers found' : 'No saved answers yet'}
          </h3>
          <p className="empty-state-description">
            {search
              ? 'Try a different search term'
              : 'Answers are saved automatically when you mark a questionnaire question as final.'}
          </p>
        </div>
      ) : (
        <div className="answers-list">
          {filteredAnswers.map(answer => (
            <div key={answer.id} className="answer-card">
              <div className="answer-question">
                <span className="question-label">Original Question</span>
                <p>{answer.questionText}</p>
              </div>

              <div className="answer-content">
                <span className="answer-label">Answer</span>
                {editingId === answer.id ? (
                  <div className="edit-area">
                    <textarea
                      className="input textarea"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={4}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button className="btn btn-ghost btn-sm" onClick={handleCancelEdit}>
                        <X size={14} />
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSaveEdit(answer.id)}
                      >
                        <Check size={14} />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{answer.answerText}</p>
                )}
              </div>

              <div className="answer-footer">
                <div className="answer-meta">
                  <div className="keywords">
                    <Hash size={12} />
                    {answer.keywords.length > 0 ? (
                      answer.keywords.map((keyword, i) => (
                        <span key={i} className="keyword-tag">
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No keywords</span>
                    )}
                  </div>
                  <span className="usage-count">Used {answer.usageCount} time{answer.usageCount !== 1 ? 's' : ''}</span>
                </div>
                <div className="answer-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleStartEdit(answer.id, answer.answerText)}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => deleteAnswer(answer.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .answer-library {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-xl);
        }

        .header-stats {
          display: flex;
          gap: var(--space-sm);
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          background: var(--color-accent-muted);
          color: var(--color-accent);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
        }

        .search-section {
          margin-bottom: var(--space-xl);
        }

        .search-bar {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: var(--space-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .search-input {
          padding-left: 44px;
        }

        .answers-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .answer-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-glass-border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .answer-question {
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--color-glass-border);
        }

        .question-label,
        .answer-label {
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: var(--space-xs);
        }

        .answer-question p,
        .answer-content p {
          font-size: var(--text-sm);
          color: var(--color-text-primary);
          margin: 0;
          line-height: var(--leading-relaxed);
        }

        .answer-content {
          margin-bottom: var(--space-md);
        }

        .edit-area {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
        }

        .answer-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .answer-meta {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
        }

        .keywords {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-text-tertiary);
          font-size: var(--text-xs);
        }

        .keyword-tag {
          background: var(--color-bg-elevated);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .usage-count {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
        }

        .answer-actions {
          display: flex;
          gap: var(--space-xs);
        }
      `}</style>
    </div>
  );
}
