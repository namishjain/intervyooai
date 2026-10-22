import { useState } from 'react'
import { Link } from 'react-router'
import '../style/interview.scss'

const demoReport = {
  matchScore: 88,
  technicalQuestions: [
    {
      question: 'Can you explain how JWT-based authentication works in a Node.js and Express application?',
      intention: 'Checks your understanding of secure authentication implementation.',
      answer: 'JWT is a stateless authentication mechanism. After validating credentials, the server creates a signed token that the client sends with subsequent requests. Middleware verifies the signature and reads the user payload to authorize access.',
    },
    {
      question: 'What is the difference between SQL and NoSQL databases, and why choose MongoDB?',
      intention: 'Assesses database selection criteria and core database knowledge.',
      answer: 'SQL databases are relational and use structured schemas, while NoSQL databases like MongoDB store flexible documents. MongoDB can be a good fit when application data maps naturally to JSON documents and the schema evolves during development.',
    },
  ],
  behavioralQuestions: [
    {
      question: 'Tell me about a time when you had to learn a new technology quickly for a project.',
      intention: 'Evaluates adaptability and your approach to continuous learning.',
      answer: 'When I needed to add computer vision to a project, I set aside focused time to study the documentation and build a small prototype. That helped me learn the core concepts quickly and integrate the feature into the dashboard.',
    },
    {
      question: 'Describe a situation where you faced a difficult bug. How did you resolve it?',
      intention: 'Assesses analytical thinking, debugging, and perseverance.',
      answer: 'I isolated the issue by writing tests around the pricing logic, then traced the state changes in the browser. This helped me find an edge case in the team-size calculation and fix it with confidence.',
    },
  ],
  skillGaps: [
    { skill: 'Enterprise Cloud Platforms (AWS/GCP/Azure)', severity: 'medium' },
    { skill: 'Advanced Testing Frameworks (Jest/Mocha)', severity: 'low' },
  ],
  preparationPlan: [
    {
      day: 1,
      focus: 'Advanced React and state management',
      tasks: ['Review React hooks and context.', 'Build a custom hook for API calls.', 'Practice component performance optimization.'],
    },
    {
      day: 2,
      focus: 'Node.js, Express, and REST APIs',
      tasks: ['Review middleware and routing.', 'Design REST endpoints with suitable status codes.', 'Practice error-handling patterns.'],
    },
    {
      day: 3,
      focus: 'Databases and MongoDB',
      tasks: ['Review schema design and validation.', 'Practice aggregation pipelines.', 'Learn indexing strategies.'],
    },
  ],
}

const sections = [
  { id: 'technical', label: 'Technical', icon: '⌘' },
  { id: 'behavioral', label: 'Behavioral', icon: '◌' },
  { id: 'roadmap', label: 'Roadmap', icon: '↗' },
]

const Interview = ({ report = demoReport }) => {
  const [activeSection, setActiveSection] = useState('technical')
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
