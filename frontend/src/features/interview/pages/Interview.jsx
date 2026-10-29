import { useState } from 'react'
import { Link } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview'
import {useParams} from 'react-router'

const sections = [
  { id: 'technical', label: 'Technical', icon: '⌘' },
  { id: 'behavioral', label: 'Behavioral', icon: '◌' },
  { id: 'roadmap', label: 'Roadmap', icon: '↗' },
]

const Interview = () => {
  const {loading, report, reportError} = useInterview()
  const {interviewId} = useParams()

  const [activeSection, setActiveSection] = useState('technical')
  if (!report || String(report._id) !== interviewId) {
    if (reportError) {
      return (
        <main className="interview-page">
          <p role="alert">{reportError}</p>
          <Link to="/">Back to workspace</Link>
        </main>
      )
    }

    return (
      <main className="interview-page" aria-live="polite">
        <p>{loading ? 'Loading your interview report...' : 'Preparing your interview report...'}</p>
      </main>
    )
  }

  const questions = activeSection === 'technical'
    ? report.technicalQuestions
    : report.behavioralQuestions
  const activeLabel = sections.find((section) => section.id === activeSection)?.label

  return (
    <main className="interview-page">
      <header className="interview-header">
        <Link className="interview-brand" to="/" aria-label="Intervyoo home">
          <span className="interview-brand-mark" aria-hidden="true">i</span>
          <span>intervyoo<span>.</span></span>
        </Link>
        <div className="interview-header-meta">
          <span className="interview-status"><span /> REPORT READY</span>
          <Link className="interview-back-link" to="/">Back to workspace <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className="interview-layout">
        <aside className="interview-nav" aria-label="Report sections">
          <div className="interview-nav-intro">
            <p className="interview-overline">YOUR REPORT</p>
            <h1>Interview<br />prep</h1>
          </div>
          <p className="interview-nav-label">PREPARATION</p>
          <nav className="interview-section-nav">
            {sections.map((section) => (
              <button
                className={`interview-nav-button${activeSection === section.id ? ' is-active' : ''}`}
                key={section.id}
                type="button"
                aria-pressed={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="interview-nav-icon" aria-hidden="true">{section.icon}</span>
                <span>{section.label}</span>
                {section.id !== 'roadmap' && (
                  <span className="interview-nav-count">
                    {(section.id === 'technical' ? report.technicalQuestions : report.behavioralQuestions)?.length ?? 0}
                  </span>
                )}
                {section.id === 'roadmap' && (
                  <span className="interview-nav-day">{report.preparationPlan?.length ?? 0} DAYS</span>
                )}
              </button>
            ))}
          </nav>

          <div className="interview-nav-tip">
            <span aria-hidden="true">✦</span>
            <p><strong>Make it yours</strong><br />Practice answers aloud and tailor them to your experience.</p>
          </div>
        </aside>

        <section className="interview-main" aria-live="polite">
          <div className="interview-main-heading">
            <div>
              <p className="interview-overline">PERSONALIZED INTERVIEW REPORT</p>
              <h2>{activeSection === 'roadmap' ? 'Your preparation roadmap' : `${activeLabel} questions`}</h2>
              <p className="interview-main-description">
                {activeSection === 'roadmap'
                  ? 'A focused plan to help you feel ready, one day at a time.'
                  : `Practice these ${activeLabel?.toLowerCase()} prompts and review what each answer should demonstrate.`}
              </p>
            </div>
            <div className="interview-score" aria-label={`Job match score ${report.matchScore} percent`}>
              <span className="interview-score-value">{report.matchScore}<small>%</small></span>
              <span className="interview-score-caption">JOB MATCH</span>
            </div>
          </div>

          {activeSection === 'roadmap' ? (
            <div className="interview-roadmap">
              {(report.preparationPlan ?? []).map((day) => (
                <article className="roadmap-day" key={day._id ?? day.day}>
                  <span className="roadmap-marker" aria-label={`Day ${day.day}`}>
                    <span>{day.day}</span>
                  </span>
                  <div className="roadmap-day-content">
                    <p className="roadmap-day-label">DAY {day.day}</p>
                    <h3>{day.focus}</h3>
                    <ul>
                      {(day.tasks ?? []).map((task) => <li key={task}>{task}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="interview-question-list">
              {(questions ?? []).map((item, index) => (
                <details className="interview-question-card" key={`${item.question}-${index}`}>
                  <summary className="interview-question-summary">
                    <span className="question-number">QUESTION {String(index + 1).padStart(2, '0')}</span>
                    <span className="question-summary-text">{item.question}</span>
                    <span className="question-chevron" aria-hidden="true" />
                  </summary>
                  <div className="interview-question-details">
                    <div className="question-detail">
                      <span className="question-detail-label">WHAT THEY’RE LOOKING FOR</span>
                      <p>{item.intention}</p>
                    </div>
                    <div className="question-answer">
                      <span className="answer-mark" aria-hidden="true">✦</span>
                      <div>
                        <span className="question-detail-label">ANSWER DIRECTION</span>
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
              {questions?.length === 0 && (
                <div className="interview-empty-state">No questions are available for this section yet.</div>
              )}
            </div>
          )}
        </section>

        <aside className="interview-skills" aria-labelledby="skills-title">
          <div className="skills-heading">
            <p className="interview-overline">WHERE TO FOCUS</p>
            <h2 id="skills-title">Skill gaps</h2>
            <p>A few areas to strengthen before your interview.</p>
          </div>
          <div className="skill-gap-list">
            {(report.skillGaps ?? []).map((gap) => (
              <article className={`skill-gap-card severity-${gap.severity?.toLowerCase()}`} key={gap.skill}>
                <div className="skill-gap-topline">
                  <span className="skill-gap-indicator" aria-hidden="true" />
                  <span className="skill-gap-severity">{gap.severity} priority</span>
                </div>
                <h3>{gap.skill}</h3>
              </article>
            ))}
            {report.skillGaps?.length === 0 && (
              <div className="skill-gap-empty">No skill gaps found. Keep building on your strengths.</div>
            )}
          </div>
          <div className="skills-footer">
            <span aria-hidden="true">↗</span>
            <p>Use your roadmap to turn these gaps into strengths.</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Interview
