import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  User,
  Calendar,
  Lightbulb,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import type { Question } from '../types/index.ts';

export function QuestionnaireDetail() {
  const { customerId, questionnaireId } = useParams<{
    customerId: string;
    questionnaireId: string;
  }>();
  const {
    getCustomer,
    getQuestionnaire,
    updateQuestionnaire,
    getSuggestedAnswers,
    addAnswer,
  } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const customer = getCustomer(customerId!);
  const questionnaire = getQuestionnaire(questionnaireId!);

  if (!customer || !questionnaire) {
    return (
      <div className="empty-state">
        <h2>Questionnaire not found</h2>
        <Link to="/customers" className="btn btn-primary mt-lg">
          Back to Customers
        </Link>
      </div>
    );
  }

  const filteredQuestions = questionnaire.questions.filter(q => {
    if (search && !q.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    return true;
  });

  const progress = questionnaire.questions.length
    ? Math.round(
      (questionnaire.questions.filter(q => q.status === 'done').length /
        questionnaire.questions.length) *
      100
    )
    : 0;

  const stats = {
    total: questionnaire.questions.length,
    done: questionnaire.questions.filter(q => q.status === 'done').length,
    inProgress: questionnaire.questions.filter(q => q.status === 'in_progress').length,
    notStarted: questionnaire.questions.filter(q => q.status === 'not_started').length,
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    const updatedQuestions = questionnaire.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    updateQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const handleSaveAnswer = (question: Question) => {
    if (!question.answer?.trim()) return;

    // Extract keywords from the question text
    const keywords = question.text
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4)
      .slice(0, 5);

    addAnswer({
      questionText: question.text,
      answerText: question.answer,
      keywords,
    });

    updateQuestion(question.id, { isFinal: true, status: 'done' });
  };

  const handleAdoptSuggestion = (questionId: string, suggestedAnswer: string) => {
    updateQuestion(questionId, { answer: suggestedAnswer });
  };

  return (
    <div className="questionnaire-detail">
      {/* Header */}
      <header className="detail-header">
        <div className="header-left">
          <Link to={`/customers/${customer.id}`} className="back-link">
            <ArrowLeft size={18} />
            <span>{customer.name}</span>
          </Link>
          <h1>{questionnaire.name}</h1>
          {questionnaire.dueDate && (
            <div className="due-date">
              <Calendar size={14} />
              <span>Due: {new Date(questionnaire.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress Section */}
      <div className="progress-section glass-card">
        <div className="progress-header">
          <div className="progress-stats">
            <span className="progress-percentage">{progress}%</span>
            <span className="progress-label">Complete</span>
          </div>
          <div className="progress-counts">
            <div className="count-item">
              <span className="count-value text-success">{stats.done}</span>
              <span className="count-label">Done</span>
            </div>
            <div className="count-item">
              <span className="count-value text-info">{stats.inProgress}</span>
              <span className="count-label">In Progress</span>
            </div>
            <div className="count-item">
              <span className="count-value text-tertiary">{stats.notStarted}</span>
              <span className="count-label">Not Started</span>
            </div>
          </div>
        </div>
        <div className="progress-bar" style={{ height: '8px' }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Search questions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {['all', 'not_started', 'in_progress', 'done'].map(status => (
            <button
              key={status}
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {filteredQuestions.map((question) => {
          const isExpanded = expandedQuestionId === question.id;
          const suggestions = isExpanded ? getSuggestedAnswers(question.text) : [];

          return (
            <div
              key={question.id}
              className={`question-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div
                className="question-header"
                onClick={() => setExpandedQuestionId(isExpanded ? null : question.id)}
              >
                <div className="question-number">
                  {question.status === 'done' ? (
                    <CheckCircle2 size={20} className="text-success" />
                  ) : question.status === 'in_progress' ? (
                    <Clock size={20} className="text-info" />
                  ) : (
                    <Circle size={20} className="text-muted" />
                  )}
                </div>
                <div className="question-content">
                  <p className="question-text">{question.text}</p>
                  <div className="question-meta">
                    {question.owner && (
                      <span className="meta-item">
                        <User size={12} />
                        {question.owner}
                      </span>
                    )}
                    {question.dueDate && (
                      <span className="meta-item">
                        <Calendar size={12} />
                        {new Date(question.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    <span className={`badge status-${question.status}`}>
                      {question.status.replace('_', ' ')}
                    </span>
                    {question.isFinal && (
                      <span className="badge badge-success">Saved to Library</span>
                    )}
                  </div>
                </div>
                <button className="expand-btn">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {isExpanded && (
                <div className="question-body">
                  {/* Suggestions */}
                  {suggestions.length > 0 && !question.answer && (
                    <div className="suggestions-panel">
                      <div className="suggestions-header">
                        <Lightbulb size={16} className="text-warning" />
                        <span>Suggested Answers</span>
                      </div>
                      <div className="suggestions-list">
                        {suggestions.map(suggestion => (
                          <div key={suggestion.id} className="suggestion-item">
                            <p className="suggestion-text">{suggestion.answerText}</p>
                            <div className="suggestion-meta">
                              <span className="text-xs text-tertiary">
                                Used {suggestion.usageCount} time
                                {suggestion.usageCount !== 1 ? 's' : ''}
                              </span>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                  handleAdoptSuggestion(question.id, suggestion.answerText)
                                }
                              >
                                <Check size={14} />
                                Use This
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Answer Input */}
                  <div className="answer-section">
                    <label className="label">Your Answer</label>
                    <textarea
                      className="input textarea"
                      placeholder="Type your answer here..."
                      value={question.answer || ''}
                      onChange={e => updateQuestion(question.id, { answer: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Actions */}
                  <div className="question-actions">
                    <div className="status-buttons">
                      <select
                        className="select"
                        value={question.status}
                        onChange={e =>
                          updateQuestion(question.id, {
                            status: e.target.value as Question['status'],
                          })
                        }
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <input
                        type="text"
                        className="input"
                        placeholder="Owner"
                        value={question.owner || ''}
                        onChange={e => updateQuestion(question.id, { owner: e.target.value })}
                        style={{ width: '150px' }}
                      />
                    </div>
                    <div className="save-buttons">
                      {!question.isFinal && question.answer && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSaveAnswer(question)}
                        >
                          <Check size={16} />
                          Save to Library
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .questionnaire-detail {
          max-width: 1000px; /* Wider layout */
          margin: 0 auto;
        }

        .detail-header {
          margin-bottom: var(--space-xl);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--color-text-primary);
        }

        .header-left h1 {
            font-size: var(--text-3xl);
            margin: var(--space-xs) 0;
            line-height: 1.2;
        }

        .due-date {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-text-tertiary);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
        }

        .progress-section {
          padding: var(--space-xl);
          margin-bottom: var(--space-xl);
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-lg);
        }

        .progress-stats {
          display: flex;
          align-items: baseline;
          gap: var(--space-sm);
        }

        .progress-percentage {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--color-accent);
          letter-spacing: -1px;
        }

        .progress-label {
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
        }

        .progress-counts {
          display: flex;
          gap: var(--space-2xl);
        }

        .count-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .count-value {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--color-text-primary);
        }

        .count-label {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        .filters-section {
          display: flex;
          gap: var(--space-lg);
          margin-bottom: var(--space-lg);
          align-items: center;
        }

        .search-bar {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .search-input {
          padding-left: 3rem;
          background: white;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-sm);
          height: 48px;
        }

        .filter-buttons {
          display: flex;
          gap: var(--space-sm);
          background: white;
          padding: 4px;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-sm);
        }

        .filter-buttons .btn {
            border-radius: var(--radius-full);
            padding: 0.5rem 1rem;
        }
        
        .filter-buttons .btn-secondary {
            box-shadow: none;
            background: transparent;
        }
        
        .filter-buttons .btn-secondary:hover {
            background: var(--color-bg-tertiary);
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .question-card {
          background: white;
          border: none;
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-base);
        }
        
        .question-card:hover {
            box-shadow: var(--shadow-md);
        }

        .question-card.expanded {
          box-shadow: var(--shadow-lg);
          transform: scale(1.005);
          z-index: 10;
        }

        .question-header {
          display: flex;
          align-items: flex-start;
          gap: var(--space-lg);
          padding: var(--space-lg);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .question-header:hover {
          background: var(--color-bg-hover);
        }

        .question-number {
          flex-shrink: 0;
          padding-top: 2px;
        }

        .question-content {
          flex: 1;
          min-width: 0;
        }

        .question-text {
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          color: var(--color-text-primary);
          margin: 0 0 var(--space-sm) 0;
          line-height: var(--leading-normal);
        }

        .question-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-md);
          align-items: center;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
          font-weight: var(--font-medium);
        }

        .expand-btn {
          background: var(--color-bg-tertiary);
          border: none;
          border-radius: var(--radius-full);
          color: var(--color-text-secondary);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        
        .expand-btn:hover {
            background: var(--color-accent-muted);
            color: var(--color-accent);
        }

        .question-body {
          padding: 0 var(--space-xl) var(--space-xl);
          border-top: 1px solid var(--color-bg-tertiary);
        }

        .suggestions-panel {
          background: #fffbeb; /* Warning-50 */
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-top: var(--space-lg);
          border: 1px solid #fcd34d; /* Warning-300 */
        }

        .suggestions-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          color: #b45309; /* Warning-700 */
          margin-bottom: var(--space-sm);
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .suggestion-item {
          background: white;
          border-radius: var(--radius-md);
          padding: var(--space-md);
          box-shadow: var(--shadow-sm);
        }

        .suggestion-text {
          font-size: var(--text-sm);
          color: var(--color-text-primary);
          margin: 0 0 var(--space-sm) 0;
          line-height: 1.5;
        }

        .suggestion-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .answer-section {
          margin-top: var(--space-lg);
        }

        .question-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-lg);
          gap: var(--space-md);
          padding-top: var(--space-md);
          border-top: 1px solid var(--color-bg-tertiary);
        }

        .status-buttons {
          display: flex;
          gap: var(--space-sm);
        }
        
        .select {
            padding: 0.5rem 2.5rem 0.5rem 1rem;
            border-radius: var(--radius-full);
            border: 1px solid var(--color-bg-tertiary);
            background-color: var(--color-bg-tertiary);
            font-size: var(--text-sm);
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.5rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
        }

        .save-buttons {
          display: flex;
          gap: var(--space-sm);
        }

        @media (max-width: 640px) {
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-buttons {
            justify-content: center;
          }

          .progress-counts {
            gap: var(--space-md);
          }

          .question-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .status-buttons, .save-buttons {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
